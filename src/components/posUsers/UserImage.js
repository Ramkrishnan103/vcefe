import React, { useEffect, useState } from "react";
import { Image, Form, Button } from "react-bootstrap-v5";
import { connect, useDispatch } from "react-redux";
import { deleteUserImage } from "../../store/action/usersImageAction";
import { addToast } from "../../store/action/toastAction";
import { getFormattedMessage } from "../../shared/sharedMethod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const UserImage = (props) => {
  const {
    fetchFiles,
    users,
    deleteUserImage,
    transferImage,
    singleImageSwitch,
  } = props;
  console.log("MultipleImage :: users", users);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imageId, setImageId] = useState();
  const [imageIdArray, setImageIdArray] = useState([]);
  const dispatch = useDispatch();
  console.log("singleImageSwitch", singleImageSwitch);
  useEffect(() => {
    fetchFiles([...images]);
  }, [images]);

  useEffect(() => {
    setOldImages(
      // product &&
      //   product[0]?.images?.imageUrls &&
      //   product[0]?.images?.imageUrls?.map((item) => item)
      users && users[0]?.imageUrl != "" && [users[0]?.imageUrl],
      
    );
    transferImage(
      users &&
        users[0]?.images?.imageUrls &&
        users[0]?.images?.imageUrls?.map((item) => item)
    );
    setImageIdArray(
      users &&
        users[0]?.images?.id &&
        users[0]?.images?.id?.map((id) => id)
    );
  }, []);

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setNewImages(newImageUrls);
  }, [images]);

  useEffect(() => {
    setImageId(imageId && deleteUserImage);
  }, [oldImages]);

  const onRemove = (index) => {
    let imgFiles = images.filter((file, i) => i !== index);
    let imgNewFiles = newImages.filter((previewImage, i) => i !== index);
    dispatch(
      addToast({
        text: getFormattedMessage("product.image.delete.success.message"),
      })
    );
    setImages(imgFiles);
    setNewImages(imgNewFiles);
    transferImage(imgFiles);
    if (imgFiles.length === 0) {
      document.getElementById("imageUrl").value = "";
    }
  };

  const oldRemoveOld = (index) => {
    let newFiles = oldImages.filter((file, i) => i !== index);
    // let imageId = imageIdArray.filter((file, i) => i === index);
    // let leftImageIdArray = imageIdArray.filter((file, i) => i !== index);
    // deleteUserImage(imageId[0]);
    setOldImages(newFiles);
    //setImageIdArray(leftImageIdArray);
    transferImage(newFiles);
  };

  const onUploadImage = (e) => {
    e.preventDefault();
    /**To Handle Multiple Image ANd Single Image */
    singleImageSwitch === "single-image"
      ? setImages([...e.target.files])
      : setImages([...e.target.files, ...images]);
console.log(images)
    dispatch(
      addToast({
        text: getFormattedMessage("product.image.success.upload.message"),
      })
    );
  };

  const handleClick = (event) => {
    const { target = {} } = event || {};
    target.value = "";
  };

  return (
    <>
      <Form.Group className="mb-3">
        <Form.Control
          type="file"
          accept=".png, .jpg, .jpeg"
          id="imageUrl"
          onClick={handleClick}
          className="upload-input-file"
          onChange={onUploadImage}
        />
      </Form.Group>
      <div className="imagePreviewContainer pt-3 p-0 d-flex flex-wrap">
        {newImages &&
          newImages.map((newImage, i) => (
           
            <div
              className="previewItem custom-preview position-relative cursor-pointer"
              key={i}
            >
              <Image className="imagePreview" src={newImage} />
              <Button
                type="button"
                onClick={() => onRemove(i)}
                className="remove-btn p-0"
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          ))}
        {oldImages &&
          oldImages.map((oldImage, i) => {
           
            return (
              <div
                className="previewItem custom-preview position-relative cursor-pointer"
                key={i}
              >
                <Image className="imagePreview" src={oldImage} />
                <Button
                  type="button"
                  onClick={() => oldRemoveOld(i)}
                  className="remove-btn p-0"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default connect(null, { deleteUserImage })(UserImage);
