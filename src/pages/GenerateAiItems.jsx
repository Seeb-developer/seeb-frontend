import { useEffect, useState } from 'react';
import axios from 'axios';

export default function GenerateAIItems() {
  const [items, setItems] = useState([]);
  const [styles, setStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [themeColors, setThemeColors] = useState({ color1: '', color2: '' });
  const [designInstruction, setDesignInstruction] = useState('');
  const [generatedImages, setGeneratedImages] = useState({});
  const [loadingItem, setLoadingItem] = useState(null);

  useEffect(() => {
    const savedItems = localStorage.getItem('ai-items');
    const baseItems = [];

    if (savedItems) {
      const parsed = JSON.parse(savedItems);
      const seen = new Set();

      const formatted = Object.entries(parsed).reduce((acc, [key, value]) => {
        const baseName = key.split('-')[0].trim().toLowerCase();
        if (!seen.has(baseName)) {
          seen.add(baseName);
          acc.push({
            id: key,
            name: baseName,
            img: `${import.meta.env.VITE_BASE_URL}${value.imgSrc}`,
          });
        }
        return acc;
      }, []);

      baseItems.push(...formatted);
    }

    // Add fixed items: Curtains, Ceiling, Final Room
    const extraItems = [
      { id: 'curtain-ai', name: 'curtain', img: '/curtains.png' },
      { id: 'ceiling-ai', name: 'ceiling', img: '/ceiling.png' },
    ];

    setItems([...baseItems, ...extraItems]);

    axios.get(`${import.meta.env.VITE_BASE_URL}styles`).then((res) => {
      if (res.data.status === 200) {
        setStyles(res.data.data);
      }
    });
  }, []);

  const generateImages = async (itemName) => {
    if (!selectedStyle) {
      alert('Please select a style before generating AI images.');
      return;
    }

    setLoadingItem(itemName);

    try {
      const promptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert prompt generator for interior design image AI tools. Create clear and concise prompts under 1500 characters using the provided item, style, and colors."
            },
            {
              role: "user",
              content: `Generate a short, vivid prompt to design a household interior item using the details below:
- Item: ${itemName}
- Style: ${selectedStyle?.name}
- Primary Color: ${themeColors.color1}
- Secondary Color: ${themeColors.color2}
- Design Notes: ${designInstruction}

Keep it brief and suitable for an AI image generation tool. Highlight the item, style, and color usage naturally.`
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      const chatData = await promptResponse.json();
      const prompt = chatData.choices?.[0]?.message?.content?.trim();
      console.log("Prompt Response:", chatData);
      console.log("Generated Prompt:", prompt);

      if (!prompt) {
        alert("Failed to generate prompt.");
        return;
      }

      const response = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          modelId: "b24e16ff-06e3-43eb-8d33-4416c2d75876",
          num_images: 2,
          width: 1024,
          height: 1024,
          guidance_scale: 7,
        }),
      });

      const data = await response.json();
      const generationId = data.sdGenerationJob.generationId;
      const statusUrl = `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`;

      let imageUrls = [];
      let tries = 0;

      while (imageUrls.length === 0 && tries < 10) {
        tries++;
        const res = await fetch(statusUrl, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY}` },
        });
        const result = await res.json();
        imageUrls = result.generations_by_pk?.generated_images?.map(img => img.url) || [];
        if (!imageUrls.length) await new Promise(res => setTimeout(res, 3000));
      }

      if (!imageUrls.length) throw new Error("No images generated.");
      setGeneratedImages((prev) => ({ ...prev, [itemName]: imageUrls }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItem(null);
    }
  };

  const generateFinalRoomImage = async () => {
    if (!selectedStyle) {
      alert("Please select a style first.");
      return;
    }

   
    setLoadingItem("final-room");

    try {
      const includedItems = items.map((item) => item.name).join(', ');

      const finalPromptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are a prompt generator for AI interior design tools. Create a single-room design prompt that combines multiple furniture items, a ceiling, and curtains. Keep it under 1500 characters."
            },
            {
              role: "user",
              content: `Generate a room interior image prompt using ALL of the following items. Each item must be explicitly mentioned in the prompt (do not skip or generalize)
- Items: ${items.map((i) => i.name).join(', ')}
- Style: ${selectedStyle?.name}
- Primary Color: ${themeColors.color1}
- Secondary Color: ${themeColors.color2}
- Design Notes: ${designInstruction}

The prompt should be short, creative, under 1500 characters, and suitable for AI image generation.`
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      const chatData = await finalPromptResponse.json();
      const finalPrompt = chatData.choices?.[0]?.message?.content?.trim();
      console.log("Final Prompt Response:", chatData);
      console.log("Final Prompt:", finalPrompt);

      if (!finalPrompt) throw new Error("Prompt generation failed");

      const response = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          modelId: "b24e16ff-06e3-43eb-8d33-4416c2d75876",
          num_images: 2,
          width: 1024,
          height: 1024,
          guidance_scale: 7,
        }),
      });

      const data = await response.json();
      const generationId = data.sdGenerationJob.generationId;
      const statusUrl = `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`;

      let imageUrls = [];
      let tries = 0;

      while (imageUrls.length === 0 && tries < 10) {
        tries++;
        const res = await fetch(statusUrl, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY}` },
        });
        const result = await res.json();
        imageUrls = result.generations_by_pk?.generated_images?.map(img => img.url) || [];
        if (!imageUrls.length) await new Promise(res => setTimeout(res, 3000));
      }

      if (!imageUrls.length) throw new Error("No final room image generated.");
      setGeneratedImages((prev) => ({ ...prev, ["final-room"]: imageUrls }));
    } catch (err) {
      console.error(err);
      alert("Final room image generation failed.");
    } finally {
      setLoadingItem(null);
    }
  };


  return (
    <div className="px-12 py-10 space-y-10 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800">🎨 AI Generated Interior Items</h1>

      {/* Style Selection */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Choose a Style</h2>
        <div className="flex flex-wrap gap-4">
          {styles.map((style) => (
            <label key={style.id} className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 border rounded shadow-sm hover:shadow-md">
              <input
                type="radio"
                name="style"
                value={style.id}
                onChange={() => setSelectedStyle(style)}
                checked={selectedStyle?.id === style.id}
              />
              <span className="capitalize font-medium text-gray-700">{style.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Theme Colors */}
      <div className="flex flex-wrap gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Primary Color</label>
          <input
            type="text"
            placeholder="e.g., white"
            value={themeColors.color1}
            onChange={(e) => setThemeColors({ ...themeColors, color1: e.target.value })}
            className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Secondary Color</label>
          <input
            type="text"
            placeholder="e.g., gold"
            value={themeColors.color2}
            onChange={(e) => setThemeColors({ ...themeColors, color2: e.target.value })}
            className="border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Instruction */}
      <div>
        <label className="block text-sm font-medium mb-1">Design Instruction</label>
        <textarea
          rows={4}
          placeholder="Describe your design preferences..."
          value={designInstruction}
          onChange={(e) => setDesignInstruction(e.target.value)}
          className="w-full border px-4 py-3 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
      </div>

      {/* Items Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {items.map((item) => (
          <div key={item.id} className="border p-5 rounded-xl shadow-md bg-white hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-2 capitalize text-gray-700">
              {item.name}
            </h3>
            <div className="flex flex-wrap gap-4 items-start">
              <img src={item.img} alt={item.name} className="w-32 h-32 object-contain rounded" />
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => generateImages(item.name)}
                  disabled={loadingItem === item.name}
                  className={`px-4 py-2 rounded text-white font-medium transition ${loadingItem === item.name ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loadingItem === item.name
                    ? 'Generating...'
                    : generatedImages[item.name]?.length
                      ? 'Generate More'
                      : 'Generate AI Images'}
                </button>
                <div className="flex gap-2 flex-wrap">
                  {(generatedImages[item.name] || []).map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt={`AI-${i}`}
                      onClick={() => window.open(imgUrl, '_blank')}
                      className="w-44 h-44 object-cover border rounded cursor-pointer hover:shadow-lg hover:border-blue-500 transition"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Room Look Section */}
      <div className="border p-5 rounded-xl shadow-md bg-white hover:shadow-xl transition mt-16">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🏠 Final Room Look</h2>
        <p className="mb-4 text-gray-600">
          Generate a complete room visualization combining all selected items in the chosen style and theme.
        </p>
        <button
          onClick={generateFinalRoomImage}
          disabled={loadingItem === 'final-room'}
          className={`px-5 py-3 rounded text-white font-semibold transition ${loadingItem === 'final-room' ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loadingItem === 'final-room' ? 'Generating...' : 'Generate Final Room Image'}
        </button>

        <div className="flex gap-2 flex-wrap mt-6">
          {(generatedImages['final-room'] || []).map((imgUrl, i) => (
            <img
              key={i}
              src={imgUrl}
              alt={`FinalRoom-${i}`}
              onClick={() => window.open(imgUrl, '_blank')}
              className="w-60 h-60 object-cover border rounded cursor-pointer hover:shadow-lg hover:border-green-500 transition"
            />
          ))}
        </div>
      </div>

    </div>
  );
}
