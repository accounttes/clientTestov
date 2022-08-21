const uploadImage = (
  isDrag: boolean,
  e: any,
  setIsNotValid: any,
  setIsFileLoading: any,
  setIsFileLoaded: any,
  setUserImg: any
) => {
  let reader = new FileReader();

  let file = isDrag ? e.dataTransfer.files[0] : e.target.files[0];
  const type = file.type.slice(file.type.indexOf("/") + 1);
  const size = Math.round(file.size / 1024 ** 2);
  const fileTypes = ["jpeg", "jpg", "png"];

  if (size > 18 || !fileTypes.includes(type)) {
    setIsNotValid(true);
  } else {
    reader.readAsDataURL(file);
    setIsFileLoading(true);
  }

  reader.onload = function () {
    const img: any = new Image();
    img.src = reader.result;

    img.onload = function () {
      const iw = img.width;
      const ih = img.height;

      if (iw < 100 || ih < 100 || iw > 8000 || ih > 8000) {
        setIsNotValid(true);
        setIsFileLoaded(false);
      } else {
        setIsFileLoaded(true);

        if (typeof reader.result === "string") {
          setUserImg(reader.result);
        }
      }

      setIsFileLoading(false);
    };
  };
};

export default uploadImage;
