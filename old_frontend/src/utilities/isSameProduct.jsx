const isSameProduct = (item1, item2) => {
    return item1._id === item2._id &&
           item1.selectedColor === item2.selectedColor 
        //    item1.selectedSize === item2.selectedSize; // si agregás más atributos
  };
  
export default isSameProduct;