const limitText = (text, limite) => {
    return text.length > limite ? text.slice(0, limite) + "..." : text;
  };
export default limitText;