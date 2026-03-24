/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import { 
  Gift, 
  User, 
  Calendar, 
  Heart, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft, 
  RefreshCw, 
  ExternalLink,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

type Step = "welcome" | "recipient" | "occasion" | "interests" | "budget" | "result";

interface ConsultationData {
  recipient: string;
  occasion: string;
  interests: string;
  budget: string;
}

const RECIPIENTS = [
  { id: "partner", label: "Người yêu / Vợ / Chồng", icon: <Heart className="w-5 h-5" /> },
  { id: "parent", label: "Bố mẹ", icon: <User className="w-5 h-5" /> },
  { id: "friend", label: "Bạn thân", icon: <User className="w-5 h-5" /> },
  { id: "colleague", label: "Đồng nghiệp / Sếp", icon: <User className="w-5 h-5" /> },
  { id: "child", label: "Trẻ em", icon: <User className="w-5 h-5" /> },
  { id: "other", label: "Khác", icon: <User className="w-5 h-5" /> },
];

const OCCASIONS = [
  { id: "birthday", label: "Sinh nhật", icon: <Calendar className="w-5 h-5" /> },
  { id: "wedding", label: "Đám cưới", icon: <Heart className="w-5 h-5" /> },
  { id: "anniversary", label: "Kỷ niệm", icon: <Calendar className="w-5 h-5" /> },
  { id: "graduation", label: "Tốt nghiệp", icon: <Sparkles className="w-5 h-5" /> },
  { id: "housewarming", label: "Tân gia", icon: <Sparkles className="w-5 h-5" /> },
  { id: "other", label: "Khác", icon: <Calendar className="w-5 h-5" /> },
];

const BUDGETS = [
  { id: "low", label: "Dưới 200k", icon: <DollarSign className="w-5 h-5" /> },
  { id: "mid", label: "200k - 500k", icon: <DollarSign className="w-5 h-5" /> },
  { id: "high", label: "500k - 1M", icon: <DollarSign className="w-5 h-5" /> },
  { id: "premium", label: "Trên 1M", icon: <DollarSign className="w-5 h-5" /> },
];

export default function App() {
  const [step, setStep] = useState<Step>("welcome");
  const [data, setData] = useState<ConsultationData>({
    recipient: "",
    occasion: "",
    interests: "",
    budget: "",
  });
  const [recommendation, setRecommendation] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step === "welcome") setStep("recipient");
    else if (step === "recipient") setStep("occasion");
    else if (step === "occasion") setStep("interests");
    else if (step === "interests") setStep("budget");
    else if (step === "budget") getRecommendation();
  };

  const handleBack = () => {
    if (step === "recipient") setStep("welcome");
    else if (step === "occasion") setStep("recipient");
    else if (step === "interests") setStep("occasion");
    else if (step === "budget") setStep("interests");
    else if (step === "result") setStep("welcome");
  };

  const updateData = (field: keyof ConsultationData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const getRecommendation = async () => {
    setStep("result");
    setLoading(true);
    try {
      const prompt = `Bạn là một chuyên gia tư vấn quà tặng cho cửa hàng 'Lanh Gift' (lanhtlu.id.vn). 
      Nhiệm vụ của bạn là dựa trên thông tin khách hàng cung cấp:
      - Người nhận: ${data.recipient}
      - Dịp lễ: ${data.occasion}
      - Sở thích: ${data.interests}
      - Ngân sách: ${data.budget}
      
      Hãy đưa ra 3-5 gợi ý quà tặng tinh tế, ý nghĩa và phù hợp với phong cách của lanhtlu.id.vn. 
      Hãy trả lời bằng tiếng Việt, phong cách lịch sự, ấm áp và chuyên nghiệp. 
      Mỗi gợi ý nên bao gồm: 
      1. Tên món quà (in đậm)
      2. Lý do chọn món quà này (ngắn gọn)
      3. Một lời chúc đi kèm phù hợp.
      
      Cuối cùng, hãy mời khách hàng ghé thăm website http://lanhtlu.id.vn/ để xem thêm nhiều sản phẩm khác.`;

      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setRecommendation(response.text || "Xin lỗi, tôi không thể đưa ra gợi ý lúc này. Vui lòng thử lại.");
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setRecommendation("Đã có lỗi xảy ra khi kết nối với chuyên gia tư vấn. Vui lòng kiểm tra kết nối mạng.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep("welcome");
    setData({ recipient: "", occasion: "", interests: "", budget: "" });
    setRecommendation("");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#4A4A40] font-serif selection:bg-[#E6E6D4]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-[#E6E6D4] z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-8 h-8 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#5A5A40]">Lanh Gift</span>
          </div>
          <a 
            href="http://lanhtlu.id.vn/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium hover:text-[#5A5A40] transition-colors flex items-center gap-1"
          >
            Ghé thăm cửa hàng <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-5xl font-light leading-tight text-[#2D2D24]">
                  Tìm món quà <br />
                  <span className="italic font-serif text-[#5A5A40]">hoàn hảo nhất</span>
                </h1>
                <p className="text-lg text-[#8A8A7A] max-w-md mx-auto">
                  Chào mừng bạn đến với chuyên gia tư vấn quà tặng của Lanh Gift. 
                  Chúng tôi sẽ giúp bạn chọn được món quà ý nghĩa nhất chỉ trong vài bước.
                </p>
              </div>
              <button
                onClick={handleNext}
                className="bg-[#5A5A40] text-white px-10 py-4 rounded-full text-lg font-medium hover:bg-[#4A4A30] transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                Bắt đầu tư vấn <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {step === "recipient" && (
            <motion.div
              key="recipient"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#8A8A7A] font-sans font-bold">Bước 1 / 4</span>
                <h2 className="text-3xl font-medium text-[#2D2D24]">Bạn muốn tặng quà cho ai?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RECIPIENTS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      updateData("recipient", item.label);
                      handleNext();
                    }}
                    className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                      data.recipient === item.label 
                        ? "border-[#5A5A40] bg-[#F5F5F0]" 
                        : "border-[#E6E6D4] hover:border-[#5A5A40] bg-white"
                    }`}
                  >
                    <div className={`p-3 rounded-2xl ${data.recipient === item.label ? "bg-[#5A5A40] text-white" : "bg-[#F5F5F0] text-[#5A5A40]"}`}>
                      {item.icon}
                    </div>
                    <span className="text-lg font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleBack} className="text-[#8A8A7A] flex items-center gap-1 hover:text-[#5A5A40] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
            </motion.div>
          )}

          {step === "occasion" && (
            <motion.div
              key="occasion"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#8A8A7A] font-sans font-bold">Bước 2 / 4</span>
                <h2 className="text-3xl font-medium text-[#2D2D24]">Nhân dịp gì thế?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {OCCASIONS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      updateData("occasion", item.label);
                      handleNext();
                    }}
                    className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                      data.occasion === item.label 
                        ? "border-[#5A5A40] bg-[#F5F5F0]" 
                        : "border-[#E6E6D4] hover:border-[#5A5A40] bg-white"
                    }`}
                  >
                    <div className={`p-3 rounded-2xl ${data.occasion === item.label ? "bg-[#5A5A40] text-white" : "bg-[#F5F5F0] text-[#5A5A40]"}`}>
                      {item.icon}
                    </div>
                    <span className="text-lg font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleBack} className="text-[#8A8A7A] flex items-center gap-1 hover:text-[#5A5A40] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
            </motion.div>
          )}

          {step === "interests" && (
            <motion.div
              key="interests"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#8A8A7A] font-sans font-bold">Bước 3 / 4</span>
                <h2 className="text-3xl font-medium text-[#2D2D24]">Sở thích của người ấy là gì?</h2>
                <p className="text-[#8A8A7A]">Hãy mô tả ngắn gọn (ví dụ: yêu thiên nhiên, thích đọc sách, mê công nghệ...)</p>
              </div>
              <div className="space-y-6">
                <textarea
                  autoFocus
                  value={data.interests}
                  onChange={(e) => updateData("interests", e.target.value)}
                  placeholder="Nhập sở thích tại đây..."
                  className="w-full p-6 rounded-3xl border-2 border-[#E6E6D4] focus:border-[#5A5A40] focus:ring-0 bg-white min-h-[150px] text-lg outline-none transition-all"
                />
                <button
                  disabled={!data.interests.trim()}
                  onClick={handleNext}
                  className="w-full bg-[#5A5A40] text-white py-4 rounded-full text-lg font-medium hover:bg-[#4A4A30] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Tiếp tục <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <button onClick={handleBack} className="text-[#8A8A7A] flex items-center gap-1 hover:text-[#5A5A40] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
            </motion.div>
          )}

          {step === "budget" && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-[#8A8A7A] font-sans font-bold">Bước 4 / 4</span>
                <h2 className="text-3xl font-medium text-[#2D2D24]">Ngân sách dự kiến?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUDGETS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      updateData("budget", item.label);
                      handleNext();
                    }}
                    className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-4 ${
                      data.budget === item.label 
                        ? "border-[#5A5A40] bg-[#F5F5F0]" 
                        : "border-[#E6E6D4] hover:border-[#5A5A40] bg-white"
                    }`}
                  >
                    <div className={`p-3 rounded-2xl ${data.budget === item.label ? "bg-[#5A5A40] text-white" : "bg-[#F5F5F0] text-[#5A5A40]"}`}>
                      {item.icon}
                    </div>
                    <span className="text-lg font-medium">{item.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleBack} className="text-[#8A8A7A] flex items-center gap-1 hover:text-[#5A5A40] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </button>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5F5F0] text-[#5A5A40] rounded-full mb-2">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-medium text-[#2D2D24]">Gợi ý dành riêng cho bạn</h2>
                <p className="text-[#8A8A7A]">Dựa trên những thông tin bạn cung cấp, đây là những món quà tuyệt vời nhất:</p>
              </div>

              <div className="bg-white p-8 rounded-[40px] border border-[#E6E6D4] shadow-sm relative overflow-hidden">
                {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <RefreshCw className="w-10 h-10 text-[#5A5A40] animate-spin" />
                    <p className="text-[#8A8A7A] animate-pulse">Đang kết nối với chuyên gia tư vấn...</p>
                  </div>
                ) : (
                  <div className="prose prose-stone max-w-none prose-headings:text-[#5A5A40] prose-p:text-[#4A4A40] prose-strong:text-[#2D2D24]">
                    <ReactMarkdown>{recommendation}</ReactMarkdown>
                  </div>
                )}
                
                {!loading && (
                  <div className="mt-10 pt-8 border-t border-[#F5F5F0] flex flex-col sm:flex-row gap-4">
                    <a 
                      href="http://lanhtlu.id.vn/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#5A5A40] text-white py-4 rounded-full font-medium hover:bg-[#4A4A30] transition-all flex items-center justify-center gap-2"
                    >
                      Đến cửa hàng ngay <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={reset}
                      className="flex-1 border-2 border-[#E6E6D4] text-[#5A5A40] py-4 rounded-full font-medium hover:bg-[#F5F5F0] transition-all flex items-center justify-center gap-2"
                    >
                      Tư vấn lại <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {!loading && (
                <div className="flex items-center justify-center gap-2 text-[#8A8A7A] text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  Gợi ý bởi AI chuyên gia của Lanh Gift
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-[#E6E6D4] bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <p className="text-sm text-[#8A8A7A]">
            © 2026 Lanh Gift. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center justify-center gap-6">
            <a href="#" className="text-xs uppercase tracking-widest text-[#8A8A7A] hover:text-[#5A5A40] transition-colors">Chính sách bảo mật</a>
            <a href="#" className="text-xs uppercase tracking-widest text-[#8A8A7A] hover:text-[#5A5A40] transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="text-xs uppercase tracking-widest text-[#8A8A7A] hover:text-[#5A5A40] transition-colors">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
