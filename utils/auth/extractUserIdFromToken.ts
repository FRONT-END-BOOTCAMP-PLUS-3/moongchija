import { jwtDecode, JwtPayload } from "jwt-decode";
interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  nickname: string;
  emoji: string;
}
export const extractUserIdFromToken = (token: string) => {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);

    return decoded.sub;
  } catch (error) {
    console.log("❌ 토큰 디코딩 오류:", error);
    return null;
  }
};
