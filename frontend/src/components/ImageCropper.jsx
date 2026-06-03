import { useState } from 'react';
import Cropper from 'react-easy-crop';

const ImageCropper = ({ imageSrc, onCropComplete, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative h-64 sm:h-96 w-full bg-black/50 rounded-xl overflow-hidden mt-2 border border-white/10">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={aspect} // Now accepts dynamic shapes!
        onCropChange={setCrop}
        onCropComplete={(croppedArea, croppedAreaPixels) => onCropComplete(croppedAreaPixels)}
        onZoomChange={setZoom}
      />
    </div>
  );
};

export default ImageCropper;