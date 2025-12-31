
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialGoal, Transaction } from "../types";

const SYSTEM_CORE = `Bạn là AI Coach Engine™, hệ thống trí tuệ nhân tạo CỐ VẤN TÀI CHÍNH – ĐỜI SỐNG – SỨC KHỎE NỀN.
Bạn KHÔNG phải chatbot. Bạn theo dõi hành vi, phân tích xu hướng, can thiệp đúng lúc và dẫn dắt sự trưởng thành.

⸻ TRIẾT LÝ GỐC ⸻
1. Tiền là hệ quả của hành vi.
2. Tự do đến từ kỷ luật.
3. Không sức khỏe = không kế hoạch tài chính.
4. AI giúp người dùng ÍT HỐI TIẾC HƠN trong 10-20 năm tới.

⸻ THÁP TÀI CHÍNH CHUẨN (CỐ ĐỊNH) ⸻
1. SỐNG SÓT (Thu < Chi)
2. BẪY ỔN ĐỊNH (Thu = Chi, không dự phòng)
3. DƯ GIẢ (Dự phòng ≥ 6 tháng)
4. TÍCH LŨY (Dự phòng ≥ 12–24 tháng + tài sản)
5. ĐẦU TƯ (≥ 2 dòng tiền)
6. TỰ DO TÀI CHÍNH (Dòng tiền thụ động > chi phí)
7. THỊNH VƯỢNG (Tài chính vững + phụng sự)

⸻ CẤU TRÚC PHẢN HỒI BẮT BUỘC ⸻
Mọi phản hồi phải có:
1. factIdentification: Nhận diện sự thật (khách quan, điềm tĩnh).
2. timeImpact: Tác động theo thời gian (mô phỏng 1-5-10 năm).
3. priceToPay: Cái giá phải trả (về thời gian, sức khỏe, tự do).
4. specificAdjustment: Điều chỉnh cụ thể (hành động thực tế).
5. accountabilityQuestion: Câu hỏi trách nhiệm (để người dùng tự vấn).

⸻ GIỌNG ĐIỆU ⸻
Điềm tĩnh, trưởng thành, không phán xét con người, chỉ phân tích hành vi. Như người đi trước 20 năm.`;

export const getCoachInsight = async (input: {
  income: number;
  expenses: number;
  reserves: number;
  goal?: string;
  contextType: 'general' | 'transaction' | 'recognition';
  transactionData?: Transaction;
}) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let prompt = "";
  if (input.contextType === 'transaction' && input.transactionData) {
    prompt = `CAN THIỆP HÀNH VI: Giao dịch "${input.transactionData.notes}", Số tiền: ${input.transactionData.amount}, Loại: ${input.transactionData.classification}. Thu nhập gốc: ${input.income}.`;
  } else {
    prompt = `PHÂN TÍCH TỔNG THỂ: Thu nhập ${input.income}, Chi tiêu ${input.expenses}, Dự phòng ${input.reserves}. Mục tiêu: ${input.goal || 'Ổn định vị thế'}.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_CORE,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            currentLevel: { type: Type.INTEGER, description: "Tầng tháp 1-7" },
            factIdentification: { type: Type.STRING },
            timeImpact: { type: Type.STRING },
            priceToPay: { type: Type.STRING },
            specificAdjustment: { type: Type.STRING },
            accountabilityQuestion: { type: Type.STRING },
            financialLongevity: { type: Type.STRING, description: "Tuổi thọ tài chính dự báo" },
            healthWarning: { type: Type.STRING, description: "Cảnh báo liên quan sức khỏe/đời sống nếu có" }
          },
          required: ["currentLevel", "factIdentification", "timeImpact", "priceToPay", "specificAdjustment", "accountabilityQuestion", "financialLongevity"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    throw error;
  }
};

// Giữ lại các hàm cũ nhưng map vào Engine™ Core
export const getFinancialAdvice = (input: any) => getCoachInsight({...input, contextType: 'general'});
export const getFinancialRecognition = (input: any) => getCoachInsight({...input, contextType: 'recognition'});
export const analyzeMistake = (tx: Transaction, ctx: any) => getCoachInsight({transactionData: tx, income: ctx.income, expenses: 0, reserves: 0, contextType: 'transaction'});

export const getGoalStrategy = async (goal: FinancialGoal, context: { income: number, savings: number }, lang: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `CHIẾN LƯỢC MỤC TIÊU: ${goal.title}, Cần: ${goal.targetAmount}, Có: ${goal.currentAmount}. Thu nhập: ${context.income}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_CORE + "\nBổ sung mục tiêu cụ thể. Trả về JSON 5 bước.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            factIdentification: { type: Type.STRING },
            timeImpact: { type: Type.STRING },
            priceToPay: { type: Type.STRING },
            specificAdjustment: { type: Type.STRING },
            accountabilityQuestion: { type: Type.STRING },
            monthlyTarget: { type: Type.STRING },
            feasibilityStatus: { type: Type.STRING }
          },
          required: ["factIdentification", "timeImpact", "priceToPay", "specificAdjustment", "accountabilityQuestion", "monthlyTarget", "feasibilityStatus"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    throw error;
  }
};

export const generateContentIdea = async (niche: string, lang: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Ý TƯỞNG NỘI DUNG: ${niche}. Dựa trên triết lý Engine™ Core.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "Bạn là chuyên gia nội dung của AI Coach Engine™. Tập trung vào giá trị thực và kỷ luật.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategyTag: { type: Type.STRING },
            contentType: { type: Type.STRING },
            hook: { type: Type.STRING },
            scriptOutline: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["strategyTag", "contentType", "hook", "scriptOutline"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    throw error;
  }
};
