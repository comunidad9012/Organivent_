// const limitText = (text, limite) => {
//     return text.length > limite ? text.slice(0, limite) + "..." : text;
//   };
// export default limitText;


const limitText = (text, maxLength) =>{
  const div = document.createElement('div');
  div.innerHTML = text;
  const plainText = div.textContent || div.innerText || '';
  return plainText.length > maxLength
    ? plainText.substring(0, maxLength) + '...'
    : plainText;
}
export default limitText;