// src/utils/showFirebaseError.ts
import { toast } from "react-toastify";

export function showFirebaseError(error: any) {
  const code = error.code || "";

  switch (code) {
    case "auth/email-already-in-use":
      toast.error("มีบัญชีนี้อยู่ในระบบแล้ว กรุณาเข้าสู่ระบบ");
      break;
    case "auth/invalid-email":
      toast.error("อีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
      break;
    case "auth/weak-password":
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      break;
    case "auth/user-not-found":
      toast.error("ไม่พบบัญชีผู้ใช้นี้");
      break;
    case "auth/wrong-password":
      toast.error("รหัสผ่านไม่ถูกต้อง");
      break;
    case "auth/too-many-requests":
      toast.error("มีการพยายามเข้าสู่ระบบผิดพลาดหลายครั้ง กรุณารอสักครู่");
      break;
    case "auth/network-request-failed":
      toast.error("การเชื่อมต่อเครือข่ายผิดพลาด กรุณาตรวจสอบอินเทอร์เน็ตของคุณ");
      break;
    default:
      toast.error(error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      break;
  }
}
