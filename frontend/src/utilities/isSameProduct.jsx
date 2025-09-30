export default function isSameProduct(a, b) {
  return (
    a._id === b._id &&
    (a.selectedVariante?._id || null) === (b.selectedVariante?._id || null)
  );
}