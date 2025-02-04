export const getKakaoUserInfo = async (accessToken: string) => {
  const userInfoUrl = "https://kapi.kakao.com/v2/user/me";

  const response = await fetch(userInfoUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();
  return data;
};
