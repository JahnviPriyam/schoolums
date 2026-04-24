export const sendChatMessage = async (message: string): Promise<string> => {
  // Simulate network delay for realistic typing effect
  return new Promise((resolve) => {
    setTimeout(() => {
      const lowerMsg = message.toLowerCase();
      
      if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
        resolve("Hello! I am your AI assistant. How can I help you manage your classes today?");
      } else if (lowerMsg.includes("mark") || lowerMsg.includes("exam")) {
        resolve("You can manage exams and enter marks in the 'Exams' section. Make sure to create an exam first!");
      } else if (lowerMsg.includes("timetable") || lowerMsg.includes("schedule")) {
        resolve("Head over to the 'Timetable' tab to schedule new classes. Let me know if you get stuck.");
      } else if (lowerMsg.includes("student")) {
        resolve("You can view and add new students from the 'Students' dashboard.");
      } else if (lowerMsg.includes("attendance")) {
        resolve("Daily attendance can be logged in the 'Attendance' portal. Choose a class and date to start.");
      } else if (lowerMsg.includes("language") || lowerMsg.includes("avatar")) {
        resolve("You can change your avatar and interface language anytime in your 'Settings'.");
      } else {
        resolve("I'm currently in a simulated generic mode. In the future, I'll be connected to a real AI backend to help you with complex queries!");
      }
    }, 1500); // 1.5s simulated delay
  });
};
