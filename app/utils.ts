 export const handleAnimationComplete = () => {
    setTimeout(() => {
      setShowSummary(true); // Show summary after a delay
    }, 500); // Adjust delay as needed
  };

export  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    // console.log(inputText);
  };
 export const handleClear = () => {
    setInputText("");
  };