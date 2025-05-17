import React, { useState, useEffect } from 'react';
import { Download, ArrowRight } from 'lucide-react';
import axios from 'axios';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';

export default function AIDesignGenerator() {
    const [activeTab, setActiveTab] = useState("Prompt");
    const [selectedSubTab, setSelectedSubTab] = useState("Modern");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [styleTabs, setStyleTabs] = useState([]);
    const [selectedStyleId, setSelectedStyleId] = useState(null);
    const [promptData, setPromptData] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [generatedImages, setGeneratedImages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [analysisText, setAnalysisText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');
    const [savedDesigns, setSavedDesigns] = useState([]);
    const user = useSelector((state) => state.user.userInfo);
    const userId = user?.id;


    const tabs = [
        { key: "Prompt", label: "💡 Prompt" },
        { key: "ai_design", label: "✨ AI Design" },
        { key: "saved", label: "🕒 Saved Designs" },
        { key: "history", label: "📜 History" }
    ];

    useEffect(() => {
        const fetchStyles = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}styles`);
                if (res.data.status === 200) {
                    const styles = res.data.data;
                    setStyleTabs(styles);
                    if (styles.length > 0) {
                        setSelectedSubTab(styles[0].name);
                        setSelectedStyleId(styles[0].id);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch styles", error);
            }
        };

        fetchStyles();
    }, []);

    useEffect(() => {
        const fetchPrompts = async () => {
            if (!selectedStyleId) return;

            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}prompts/style/${selectedStyleId}`);
                if (res.data.status === 200) {
                    setPromptData(res.data.data);
                } else {
                    setPromptData([]);
                }
            } catch (error) {
                console.error("Failed to fetch prompts", error);
                setPromptData([]);
            }
        };

        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}freepik-api/user/${userId}`);
                if (res.data?.data) {
                    setHistoryData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch history", err);
                setHistoryData([]);
            }
        };

        const fetchSavedDesigns = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}selected-design/${userId}`);
                if (res.data?.data) {
                    setSavedDesigns(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch saved designs", err);
                setSavedDesigns([]);
            }
        };

        if (activeTab === "saved") {
            fetchSavedDesigns();
        }

        if (activeTab === "history") {
            fetchHistory();
        }

        if (activeTab === "Prompt") {
            fetchPrompts();
        }
    }, [selectedStyleId, activeTab]);

    const handleDownload = (url) => {
        const link = document.createElement("a");
        link.href = `${import.meta.env.VITE_BASE_URL}${url}`;
        link.download = url.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const fetchImages = async (promptText) => {

        setIsGenerating(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}freepik-api/image-generate`, {
                user_id: userId,
                prompt: promptText,
            });

            if (res.data.data?.images && Array.isArray(res.data.data.images)) {
                setGeneratedImages(prev => [...prev, ...res.data.data.images]);
            }
        } catch (err) {
            console.error("Image generation failed", err);
        }
        setIsGenerating(false);
    };

    const handlePromptGenerate = async (prompt) => {
        setActiveTab("ai_design");
        setPrompt(prompt);
        setGeneratedImages([]);
        await fetchImages(prompt);
    };

    const openModal = async (imageUrl) => {
        setModalData(imageUrl);
        setIsModalOpen(true);
        setIsLoading(true);
        setAnalysisText('');

        try {
            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}ai-api-history/analyze-image`, {
                user_id: userId,
                image_url: imageUrl,
            });

            if (res.data.data && res.data.data.analysis) {
                setAnalysisText(res.data.data.analysis);
            } else {
                setAnalysisText("No analysis data found.");
            }
        } catch (error) {
            console.error("Analysis failed", error);
            setAnalysisText("Error while analyzing image.");
        }

        setIsLoading(false);
    };

    const handleSaveDesign = async () => {
        if (!modalData) return;

        setIsSaving(true);
        setSaveMessage('');

        try {
            const imagePath = modalData.replace(import.meta.env.VITE_BASE_URL, ''); // extract relative path

            const res = await axios.post(`${import.meta.env.VITE_BASE_URL}selected-design/save`, {
                user_id: userId,
                image_path: imagePath,
            });

            if (res.data?.status === 200) {
                setSaveMessage('Design saved successfully.');
            } else {
                setSaveMessage('Failed to save design.');
            }
        } catch (error) {
            console.error("Save failed", error);
            setSaveMessage('Error while saving design.');
        }

        setIsSaving(false);
    };


    return (
        <div className="px-4 md:px-10 py-8 max-w-7xl mx-auto bg-white min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Design Generator</h1>

            {/* Main Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab === tab.key ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Style Sub-Tabs (Only for Prompt) */}
            {activeTab === "Prompt" && (
                <>
                    <div className="flex flex-wrap gap-3 mb-8">
                        {styleTabs.map((subTab) => (
                            <button
                                key={subTab.id}
                                onClick={() => {
                                    setSelectedSubTab(subTab.name);
                                    setSelectedStyleId(subTab.id);
                                }}
                                className={`px-4 py-1 rounded-full text-sm capitalize transition-all font-semibold ${selectedSubTab === subTab.name
                                    ? "bg-yellow-500 text-white"
                                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                    }`}
                            >
                                {subTab.name}
                            </button>
                        ))}
                    </div>

                    {/* Section Heading */}
                    <h2 className="text-2xl font-bold text-gray-700 mb-6 capitalize">
                        {selectedSubTab} Designs
                    </h2>

                    {promptData.length === 0 ? (
                        <p className="text-center text-gray-400">
                            No designs available in this category.
                        </p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {promptData.map((item, idx) => (
                                    <div key={idx}>
                                        <div className="relative group mb-2 overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all" onClick={() => handlePromptGenerate(item.prompt)}>
                                            <img
                                                src={`${import.meta.env.VITE_BASE_URL}${item.image_path}`}
                                                alt={item.prompt}
                                                className="w-full h-64 object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null; // prevents looping
                                                    e.target.src = `/no-image.png`; // fallback image
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                                                <div
                                                    className="flex justify-between items-center cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openModal(`${import.meta.env.VITE_BASE_URL}${item.image_path}`)
                                                    }}
                                                >
                                                    <p className="text-white font-medium text-sm">
                                                        Analyze Design With AI
                                                    </p>
                                                    <ArrowRight className="text-white" size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700">{item.prompt}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}

            {activeTab === "ai_design" && (
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">AI Design Generator</h2>

                    {/* Prompt Input */}
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter your design prompt"
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={async () => {
                                setGeneratedImages([]);
                                await fetchImages(prompt);
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                            disabled={isGenerating}
                        >
                            {isGenerating && generatedImages.length === 0 ? 'Generating...' : 'Generate Image'}
                        </button>
                    </div>

                    {/* Generated Images */}
                    <div className="max-h-[500px] overflow-y-auto pr-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 relative">
                            {generatedImages.map((img, idx) => (
                                <div key={idx} className="relative">
                                    <img
                                        src={`${import.meta.env.VITE_BASE_URL}${img}`}
                                        alt={`Generated ${idx}`}
                                        className="w-full h-60 object-cover rounded-md"
                                    />
                                    <div
                                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer"
                                        onClick={() => handleDownload(img)}
                                    >
                                        <Download size={18} className="text-blue-600" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Generate More Button */}
                    {generatedImages.length > 0 && (
                        <div className="mt-4 flex justify-center">
                            <button
                                onClick={() => fetchImages(prompt)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                                disabled={isGenerating}
                            >
                                {isGenerating ? 'Generating...' : 'Generate More'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === "saved" && (
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">Saved Designs</h2>

                    {savedDesigns.length === 0 ? (
                        <p className="text-center text-gray-400">No saved designs found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {savedDesigns.map((item, idx) => (
                                <div key={idx}>
                                    <div
                                        className="relative group mb-2 overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all"
                                        onClick={() =>
                                            openModal(`${import.meta.env.VITE_BASE_URL}${item.image_path}`)
                                        }
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}${item.image_path}`}
                                            alt={`Saved ${idx}`}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                                            <div
                                                className="flex justify-between items-center cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openModal(`${import.meta.env.VITE_BASE_URL}${item.image_path}`);
                                                }}
                                            >
                                                <p className="text-white font-medium text-sm">
                                                    Analyze Design With AI
                                                </p>
                                                <ArrowRight className="text-white" size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}


            {activeTab === "history" && (
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-700 mb-6">History</h2>

                    {historyData.length === 0 ? (
                        <p className="text-center text-gray-400">No history found.</p>
                    ) : (
                        <div className="space-y-10">
                            {historyData.map((entry) => {
                                let images = [];
                                try {
                                    images = JSON.parse(entry.images);
                                } catch (e) {
                                    console.warn("Invalid images JSON in entry", entry.id);
                                }

                                return (
                                    <div key={entry.id}>
                                        <p className="text-lg font-semibold text-gray-800 mb-3">
                                            Prompt: <span className="font-normal">{entry.prompt}</span>
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {images.map((img, idx) => (
                                                <div key={idx} className="relative">
                                                    <img
                                                        src={`${import.meta.env.VITE_BASE_URL}${img}`}
                                                        alt={`History ${entry.prompt} ${idx}`}
                                                        className="w-full h-60 object-cover rounded-md"
                                                    />
                                                    <div
                                                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer"
                                                        onClick={() => handleDownload(img)}
                                                    >
                                                        <Download size={18} className="text-blue-600" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                className="bg-black bg-opacity-80 fixed inset-0 flex items-center justify-center z-50"
                overlayClassName="Overlay"
                ariaHideApp={false}
            >
                <div className="bg-white rounded-lg w-[90%] max-w-5xl relative p-4">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-2 right-3 text-black font-bold text-xl"
                    >
                        ✕
                    </button>

                    <h3 className="text-xl font-bold mb-4 text-gray-800">Image Analysis</h3>

                    {modalData && (
                        <img
                            src={modalData}
                            alt="Analyzed"
                            className="w-full max-h-[300px] object-contain mb-4 rounded"
                            onError={(e) => {
                                e.target.onerror = null; // prevents looping
                                e.target.src = `/no-image.png`; // fallback image
                            }}
                        />
                    )}

                    {isLoading ? (
                        <p className="text-center text-blue-500 font-medium">Analyzing image...</p>
                    ) : (
                        <p className="text-gray-700 whitespace-pre-line">{analysisText}</p>
                    )}

                    {/* Save Design Button */}
                    {activeTab !== "saved" && (
                        <div className="mt-4 flex flex-col items-center gap-2">
                            <button
                                onClick={handleSaveDesign}
                                disabled={isSaving}
                                className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {isSaving ? 'Saving...' : 'Save Design'}
                            </button>

                            {saveMessage && (
                                <p className="text-sm text-gray-600">{saveMessage}</p>
                            )}
                        </div>
                    )}


                </div>
            </Modal>


        </div>
    );
}
