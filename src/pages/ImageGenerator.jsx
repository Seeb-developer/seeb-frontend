import { useState } from "react";
import axios from "axios";
import { GoogleGenAI, Modality } from "@google/genai";


export default function ImageGeneratorPage() {
    const [prompt, setPrompt] = useState("");
    const [images, setImages] = useState({
        chatgpt: [],
        freepik: [],
        gemini: [],
        leonardo: [],
    });
    const [loading, setLoading] = useState({
        chatgpt: false,
        freepik: false,
        gemini: false,
        leonardo: false,
    });

    const updateImage = (source, newImages) => {
        setImages((prev) => ({ ...prev, [source]: newImages }));
        setLoading((prev) => ({ ...prev, [source]: false }));
    };

    const generateChatGPTImage = async () => {
        if (!prompt.trim()) return;
        setLoading((prev) => ({ ...prev, chatgpt: true }));

        try {
            const res = await fetch("https://api.openai.com/v1/images/generations", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt,
                    n: 1,
                    size: "1024x1024",
                    model: "dall-e-3",
                }),
            });
            const data = await res.json();
            const urls = data.data?.map((img) => img.url) || [];
            updateImage("chatgpt", urls);
        } catch (err) {
            console.error("ChatGPT image error:", err);
            updateImage("chatgpt", []);
        }
    };

    const generateFreepikImage = async () => {
        if (!prompt.trim()) return;
        setLoading((prev) => ({ ...prev, freepik: true }));

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}freepik-api/image-generate`, {
                user_id: 150,
                prompt,
            });

            const urls = res.data.data?.images?.map((img) =>
                `${import.meta.env.VITE_BASE_URL}${img}`
            ) || [];
            updateImage("freepik", urls);
        } catch (err) {
            console.error("Freepik image error:", err);
            updateImage("freepik", []);
        }
    };

const generateGeminiImage = async () => {
  if (!prompt.trim()) return;
  setLoading((prev) => ({ ...prev, gemini: true }));

  try {
    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
    });

    // Optional: provide base64Image here if needed
    const base64Image = ""; // Or load from file/input if applicable

    const contents = [
      { text: prompt },
      ...(base64Image
        ? [
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Image,
              },
            },
          ]
        : []),
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
        numImages: 1,
      },
    });

    const generatedImages = [];
    if (response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
          generatedImages.push(imageUrl);
          break;
        }
      }
    }

    updateImage("gemini", generatedImages);
  } catch (err) {
    console.error("Gemini SDK image error:", err);
    updateImage("gemini", []);
  } finally {
    setLoading((prev) => ({ ...prev, gemini: false }));
  }
};

    const generateLeonardoImage = async () => {
        if (!prompt.trim()) return;
        setLoading((prev) => ({ ...prev, leonardo: true }));

        try {
            const res = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY}`,
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
            const data = await res.json();
            const generationId = data.sdGenerationJob?.generationId;
            const statusUrl = `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`;

            let urls = [];
            let tries = 0;
            while (urls.length === 0 && tries < 10) {
                tries++;
                const statusRes = await fetch(statusUrl, {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_LEONARDO_API_KEY}`,
                    },
                });
                const statusData = await statusRes.json();
                urls =
                    statusData.generations_by_pk?.generated_images?.map((img) => img.url) || [];
                if (!urls.length) await new Promise((r) => setTimeout(r, 3000));
            }

            updateImage("leonardo", urls);
        } catch (err) {
            console.error("Leonardo image error:", err);
            updateImage("leonardo", []);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
                <h1 className="text-2xl font-bold mb-4">AI Image Generator</h1>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    placeholder="Enter your image prompt..."
                    className="w-full p-3 border rounded-md mb-4"
                />

                <div className="flex flex-wrap gap-4">
                    <button
                        onClick={generateChatGPTImage}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        Generate with ChatGPT
                    </button>
                    <button
                        onClick={generateFreepikImage}
                        className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
                    >
                        Generate with Freepik
                    </button>
                    <button
                        onClick={generateGeminiImage}
                        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                        Generate with Gemini
                    </button>
                    <button
                        onClick={generateLeonardoImage}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Generate with Leonardo
                    </button>
                </div>
            </div>

            {/* Image Display */}
            <div className="max-w-5xl mx-auto mt-10 space-y-10">
                {["chatgpt", "freepik", "gemini", "leonardo"].map((source) => (
                    <div key={source}>
                        <h2 className="text-xl font-semibold capitalize mb-4">{source} Results</h2>
                        {loading[source] ? (
                            <p className="text-gray-600">Loading {source} images...</p>
                        ) : images[source].length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images[source].map((src, idx) =>
                                    (
                                        <img
                                            key={idx}
                                            src={src}
                                            alt={`${source} result ${idx + 1}`}
                                            // crossOrigin="anonymous"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                            }}
                                            className="w-full rounded-lg border"
                                        />
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No images generated.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

