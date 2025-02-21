const handleTranslate = async (messageId: number) => {
  console.log(inputText);
  
  if ("ai" in self && "translator" in self.ai) {
    console.log("// The Translator API is supported.");
  }
  const message = messages.find((msg) => msg.id === messageId);
  if (!message) return;

  const translatorCapabilities = await self.ai.translator.capabilities();

  console.log(translatorCapabilities);
  
  // const canTranslate = translatorCapabilities["available"];

  let translator;

  if (canTranslate === "readily") {
    console.log("");

    translator = await self.ai.translator.create({
      sourceLanguage: detectedLanguage,
      targetLanguage: selectedLanguage,
    });

    console.log(await translator.translate(inputText));
    // "Où est le prochain arrêt de bus, s'il vous plaît ?"
    // try {
    //   const { translation } = await mockTranslator(
    //     message.text,
    //     selectedLanguage
    //   );
    //   updateMessage(messageId, { translation });
    // } catch (error) {
    //   console.error("Translation failed:", error);
    // }
  }
};