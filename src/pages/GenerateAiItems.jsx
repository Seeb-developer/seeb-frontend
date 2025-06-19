import { useEffect, useState } from 'react';
import axios from 'axios';
import { Save, Check } from 'lucide-react';
import { useSelector } from "react-redux";

export default function GenerateAIItems() {
  const [items, setItems] = useState([]);
  const [styles, setStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [themeColors, setThemeColors] = useState({ color1: '', color2: '' });
  const [designInstruction, setDesignInstruction] = useState('');
  const [generatedImages, setGeneratedImages] = useState({});
  const [loadingItem, setLoadingItem] = useState(null);
  const [selectedView, setSelectedView] = useState("corner"); // "top", "corner", "eye"
  const [selectedCorner, setSelectedCorner] = useState("A-B"); // "A-B", "B-C", "C-D", "D-A"
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [isSaved, setIsSaved] = useState(false);


  const savedItems = sessionStorage.getItem('floorplan-items');
  const fpsize = sessionStorage.getItem('floorplan-size');
  const fpname = sessionStorage.getItem('floorplan-name');
  const fpImage = sessionStorage.getItem('floorplan-image');
  const userDetail = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    const baseItems = [];
    if (savedItems) {
      const parsed = JSON.parse(savedItems);
      const formatted = Object.entries(parsed).map(([id, data]) => {
        const baseName = data.name.split('-')[0].trim().toLowerCase();
        return {
          id,
          name: baseName,
          img: `${import.meta.env.VITE_BASE_URL}${data.image}`
        };
      });

      baseItems.push(...formatted);
    }

    // Add fixed items: Curtains, Ceiling, Final Room
    const extraItems = [
      { id: 'curtain-ai', name: 'curtain', img: '/curtains.png' },
      { id: 'ceiling-ai', name: 'ceiling', img: '/ceiling.png' },
    ];

    setItems([...baseItems, ...extraItems]);

    axios.get(`${import.meta.env.VITE_BASE_URL}styles/by-category`).then((res) => {
      if (res.data.status === 200) {
        setStyles(res.data.data);
      }
    });
  }, []);

  const toggleCategory = (categoryId) => {
    setActiveCategoryId(prev => prev === categoryId ? null : categoryId);
  };

  const generateItemImages = async (itemName) => {
    // if (!selectedStyle) {
    //   alert('Please select a style before generating AI images.');
    //   return;
    // }

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
              content: `Generate a photorealistic, isolated image of a ${itemName} in ${selectedStyle?.name} style, designed for a ${fpsize}ft ${fpname} with a room height of 10-12 ft.
            The ${itemName} should appear alone on a plain white background — no walls, no floor, no windows, and no surrounding decor or context. Focus entirely on the item itself.
            Use primary color ${themeColors.color1} and secondary color ${themeColors.color2}. Apply realistic proportions, material finishes, and design details that reflect the ${selectedStyle?.name} aesthetic.
            Category: ${categoryName}  
            Design Notes: ${designInstruction}
            Keep it brief, clean, and suitable for AI image generation. Emphasize the item's style and function without adding any background elements.`
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      const chatData = await promptResponse.json();
      const prompt = chatData.choices?.[0]?.message?.content?.trim();
      console.log("Generated Prompt:", prompt);

      if (!prompt) {
        alert("Failed to generate prompt.");
        return;
      }


      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}freepik-api/image-generate`, {
        user_id: 150,
        prompt,
        type: "floorplan"
      });

      const imageUrls = res.data.data?.images?.map((img) =>
        `${import.meta.env.VITE_BASE_URL}${img}`
      ) || [];


      // const res = await fetch("https://api.openai.com/v1/images/generations", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     prompt,
      //     n: 1,
      //     size: "1024x1024",
      //     model: "dall-e-3",
      //   }),
      // });
      // const data = await res.json();
      // const imageUrls = data.data?.map((img) => img.url) || [];

      // console.log(imageUrls);



      // const response = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY}`,
      //   },
      //   body: JSON.stringify({
      //     prompt,
      //     modelId: "b24e16ff-06e3-43eb-8d33-4416c2d75876",
      //     num_images: 2,
      //     width: 1024,
      //     height: 1024,
      //     guidance_scale: 7,
      //   }),
      // });

      // const data = await response.json();
      // const generationId = data.sdGenerationJob.generationId;
      // const statusUrl = `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`;

      // let imageUrls = [];
      // let tries = 0;

      // while (imageUrls.length === 0 && tries < 10) {
      //   tries++;
      //   const res = await fetch(statusUrl, {
      //     headers: { Authorization: `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY}` },
      //   });
      //   const result = await res.json();
      //   imageUrls = result.generations_by_pk?.generated_images?.map(img => img.url) || [];
      //   if (!imageUrls.length) await new Promise(res => setTimeout(res, 3000));
      // }

      if (!imageUrls.length) throw new Error("No images generated.");
      setGeneratedImages((prev) => ({ ...prev, [itemName]: imageUrls }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingItem(null);
    }
  };

  const selectedCategory = styles.find(cat => cat.id === activeCategoryId);
  const categoryName = selectedCategory?.name || "";

  const generateFinalRoomImage = async () => {

    // if (!selectedStyle || !activeCategoryId) {
    //   alert("Please select a style first.");
    //   return;
    // }

    setLoadingItem("final-room");

    const base64Only = fpImage.split(',')[1];

    try {

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
              content: "You are a prompt generator for AI interior design tools. Create a single-room design prompt that combines multiple furniture items, a ceiling, and curtains."
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Generate a detailed prompt for a photorealistic interior image of a ${fpsize}ft ${fpname} using the attached floorplan as a strict layout reference.

              Layout Orientation (IMPORTANT):
              - Top of the image = North wall
              - Bottom = South wall
              - Left = West wall
              - Right = East wall

              Instructions:
              - Use the exact placement of each furniture item as shown in the floorplan image.
              - Mention the orientation and wall alignment of each item explicitly.
              - Describe the relative positions between items (e.g., "the sofa faces the TV", "the book rack is placed against the west wall").
              - Do NOT rearrange, skip, or generalize any furniture item.
              - Focus on spatial relationships and layout accuracy.

              Room Details:
              - Room Name: ${fpname}
              - Style: ${selectedStyle?.name}
              - Category: ${categoryName}
              - View: ${selectedView.replace("-", " ")}${selectedView === "corner-view" ? ` from corner ${selectedCorner}` : ""}
              - Primary Color: ${themeColors.color1}
              - Secondary Color: ${themeColors.color2}
              - Design Notes: ${designInstruction}
              - Items: ${items.map((i) => i.name).join(', ')}

              Ensure the prompt is creative, under 1500 characters, and suitable for AI-based interior image generation.`
                },

                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/png;base64,${base64Only}`
                  }
                }
              ]
            }
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      });

      const chatData = await finalPromptResponse.json();
      const finalPrompt = chatData.choices?.[0]?.message?.content?.trim();
      console.log("Final Prompt:", finalPrompt);

      if (!finalPrompt) throw new Error("Prompt generation failed");


      // freepik.ai

      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}freepik-api/image-generate`, {
        user_id: 150,
        prompt: finalPrompt,
        type: "floorplan"
      });

      const imageUrls = res.data.data?.images?.map((img) =>
        `${import.meta.env.VITE_BASE_URL}${img}`
      ) || [];

      // chatgpt.ai

      // const res = await fetch("https://api.openai.com/v1/images/generations", {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     prompt: finalPrompt,
      //     n: 1,
      //     size: "1024x1024",
      //     model: "dall-e-3",
      //   }),
      // });
      // const data = await res.json();
      // const imageUrls = data.data?.map((img) => img.url) || [];

      // console.log(imageUrls);

      // leonardi.ai

      // const response = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY}`,
      //   },
      //   body: JSON.stringify({
      //     prompt: finalPrompt,
      //     modelId: "b24e16ff-06e3-43eb-8d33-4416c2d75876",
      //     num_images: 2,
      //     width: 1024,
      //     height: 1024,
      //     guidance_scale: 7,
      //   }),
      // });

      // const data = await response.json();
      // const generationId = data.sdGenerationJob.generationId;
      // const statusUrl = `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`;

      // let imageUrls = [];
      // let tries = 0;

      // while (imageUrls.length === 0 && tries < 10) {
      //   tries++;
      //   const res = await fetch(statusUrl, {
      //     headers: { Authorization: `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY}` },
      //   });
      //   const result = await res.json();
      //   imageUrls = result.generations_by_pk?.generated_images?.map(img => img.url) || [];
      //   if (!imageUrls.length) await new Promise(res => setTimeout(res, 3000));
      // }

      if (!imageUrls.length) throw new Error("No final room image generated.");
      setGeneratedImages((prev) => ({ ...prev, ["final-room"]: imageUrls }));
    } catch (err) {
      console.error(err);
      alert("Final room image generation failed.");
    } finally {
      setLoadingItem(null);
    }
  };

  const handleSaveDesign = async () => {
    try {
      const uploadedURLs = {};

      const uploadSingleImage = async (base64Data) => {
        try {
          const blob = await (await fetch(base64Data)).blob();
          const formData = new FormData();
          formData.append("file", blob, "upload.png");

          const uploadRes = await axios.post(
            `${import.meta.env.VITE_BASE_URL}floor-plans/upload-image`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          return uploadRes.data?.file_path || "";
        } catch (err) {
          console.error("Image upload failed:", err);
          return "";
        }
      };


      // Upload floorplan image
      const floorplanImageUrl = await uploadSingleImage(fpImage);
      uploadedURLs.floorplan_image = floorplanImageUrl;
      // Upload floor3d image (take the first from generatedImages['final-room'])
      // const finalRoomImage = generatedImages["final-room"];

      const finalRoomImages = (generatedImages["final-room"] || []).map(img =>
        img.replace("https://backend.seeb.in/", "")
      );
      uploadedURLs.floor3d_image = finalRoomImages;

      // Upload all item images
      const elements = [];

      for (const item of items) {
        const name = item.name;
        const genImages = generatedImages[name] || [];

        if (genImages.length > 0) {
          const cleanedImages = genImages.map(img =>
            img.replace("https://backend.seeb.in/", "")
          );

          elements.push({
            name,
            image: cleanedImages, // Now holds cleaned relative URLs
          });
        }
      }




      const payload = {
        user_id: userDetail.id,
        room_name: fpname,
        room_size: fpsize,
        name: designInstruction,
        primary_color: themeColors.color1,
        accent_color: themeColors.color2,
        style_name: selectedStyle?.name,
        floorplan_image: uploadedURLs.floorplan_image,
        floor3d_image: JSON.stringify(uploadedURLs.floor3d_image),
        elements_json: JSON.stringify(elements),
      };

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}floor-plans`,
        payload
      );
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 1000);
      // alert("Design saved successfully!");
    } catch (error) {
      console.error("Error saving design:", error);
    }
  };


  return (
    <div className="px-12 py-10 space-y-10 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div className="flex flex-row items-center justify-between mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">🎨 AI Generated Interior Items</h1>
        <div className="flex gap-2">
          {isSaved ? (
            <button className="bg-green-600 text-white font-medium px-4 py-2 rounded-xl flex items-center gap-2 transition">
              <Check /> Saved Design
            </button>
          ) : (
            <button
              onClick={handleSaveDesign}
              className="bg-purple-600 text-white font-medium px-4 py-2 rounded-xl hover:bg-purple-700 flex items-center gap-2 transition"
            >
              <Save /> Save Design
            </button>
          )}

        </div>
      </div>
      {/* Style Selection */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Choose a Style</h2>
        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex flex-wrap gap-2 border-b pb-2">
            {styles.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`px-5 py-2 rounded-t-md text-sm font-semibold transition border-b-2
        ${activeCategoryId === category.id
                    ? "border-purple-600 text-purple-700 bg-purple-50"
                    : "border-transparent text-gray-500 hover:text-purple-600 hover:bg-gray-50"
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Styles List (shown only for active category) */}
        {styles
          .filter((cat) => cat.id === activeCategoryId)
          .map((category) => (
            <div key={category.id} className="mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {category.styles.map((style) => (
                  <label
                    key={style.id}
                    className={`p-3 border rounded-lg shadow-sm cursor-pointer transition-all text-center text-sm
              ${selectedStyle?.id === style.id
                        ? "bg-purple-100 border-purple-500 ring-2 ring-purple-300"
                        : "bg-white hover:bg-gray-50"
                      }`}
                  >
                    <input
                      type="radio"
                      name="style"
                      value={style.id}
                      onChange={() => setSelectedStyle(style)}
                      checked={selectedStyle?.id === style.id}
                      className="hidden"
                    />
                    <span className="capitalize text-gray-800 font-medium block">
                      {style.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Theme Colors */}
      <div>
        <h2 className='text-lg font-semibold text-gray-800 mb-3 capitalize'>choose a theme color</h2>
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
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">View Settings</h2>
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              View Type
            </label>
            <div className="flex flex-wrap gap-2">
              {["Top View", "Corner View"].map((view) => (
                <label
                  key={view}
                  className={`flex items-center justify-center px-4 py-2 border rounded cursor-pointer ${selectedView === view.toLowerCase().replace(" ", "-")
                    ? "bg-purple-100 border-purple-500"
                    : "bg-white"
                    }`}
                >
                  <input
                    type="radio"
                    name="viewType"
                    value={view.toLowerCase().replace(" ", "-")}
                    checked={selectedView === view.toLowerCase().replace(" ", "-")}
                    onChange={(e) => setSelectedView(e.target.value)}
                    className="hidden"
                  />
                  <span>{view}</span>
                </label>
              ))}
            </div>
          </div>

          {/* {selectedView === "corner-view" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Corner
              </label>
              <div className="flex flex-wrap gap-2">
                {["A-C", "C-B", "B-D", "D-A"].map((corner) => (
                  <label
                    key={corner}
                    className={`flex items-center justify-center px-3 py-1 border rounded cursor-pointer ${selectedCorner === corner
                      ? "bg-purple-100 border-purple-500"
                      : "bg-white"
                      }`}
                  >
                    <input
                      type="radio"
                      name="cornerType"
                      value={corner}
                      checked={selectedCorner === corner}
                      onChange={(e) => {
                        setSelectedCorner(e.target.value);
                      }}
                      className="hidden"
                    />
                    <span>Corner {corner}</span>
                  </label>
                ))}
              </div>
            </div>
          )} */}
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

      {/* Final Room Look Section */}
      <div className="border p-5 rounded-xl shadow-md bg-white hover:shadow-xl transition mt-16">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🏠 Room Look</h2>
        <p className="mb-6 text-gray-600">
          Generate a complete room visualization combining all selected items in the chosen style and theme.
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Floorplan Image (left side) */}
          {fpImage && (
            <img
              src={fpImage}
              alt="Floorplan Preview"
              className="w-[500px] h-[500px] object-contain border rounded shadow-sm"
            />
          )}

          {/* Button (right side) */}
          <div className="flex flex-col gap-4">
            <button
              onClick={generateFinalRoomImage}
              disabled={loadingItem === 'final-room'}
              className={`px-5 py-3 rounded text-white font-semibold transition ${loadingItem === 'final-room'
                ? 'bg-gray-400'
                : 'bg-green-600 hover:bg-green-700'
                }`}
            >
              {loadingItem === 'final-room' ? 'Generating...' : 'Generate Room Image'}
            </button>
            {/* Generated Images */}
            <div className="flex gap-2 flex-wrap mt-6">
              {(generatedImages['final-room'] || []).map((imgUrl, i) => (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`FinalRoom-${i}`}
                  onClick={() => window.open(imgUrl, '_blank')}
                  className="w-96 h-96 object-cover border rounded cursor-pointer hover:shadow-lg hover:border-green-500 transition"
                />
              ))}
            </div>
          </div>
        </div>
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
                  onClick={() => generateItemImages(item.name)}
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

    </div>
  );
}
