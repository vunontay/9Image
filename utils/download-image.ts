import { TPhotoData } from "@/types/server/type-photo";

export async function handleDownloadImage(photo: TPhotoData) {
    fetch(photo.imgUrl)
        .then((response) => response.blob())
        .then((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = photo.imgName;
            document.body.appendChild(a);
            a.click();

            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
}
