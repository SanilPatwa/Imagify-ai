export const generateImageFromPrompt = (prompt: string): string => {
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}`;
};
