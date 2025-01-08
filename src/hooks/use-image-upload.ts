import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../..//convex/_generated/dataModel";
import { useRef, useState } from "react";

export function useImageUpload() {
	const generateUploadUrl = useMutation(
		api.functions.storage.generateUploadUrl
	);

	const [storageId, setStorageId] = useState<Id<"_storage"> | undefined>(
		undefined
	);

	const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

	const [isUploading, setIsUploading] = useState<boolean>(false);

	const inputRef = useRef<HTMLInputElement | null>(null);

	const open = () => {
		if (inputRef.current) {
			inputRef.current.click();
		}
	};

	const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setIsUploading(true);
			setPreviewUrl(URL.createObjectURL(file));
			const uploadUrl = await generateUploadUrl();
			const response = await fetch(uploadUrl, {
				method: "POST",
				body: file,
				headers: { "Content-Type": file.type },
			});
			const data = (await response.json()) as { storageId: Id<"_storage"> };
			setStorageId(data.storageId);
			setIsUploading(false);
		}
	};
	const reset = () => {
		setStorageId(undefined);
		setPreviewUrl(undefined);
		if (inputRef.current) {
			inputRef.current.value = "";
		}
	};

	return {
		storageId,
		previewUrl,
		isUploading,
		open,
		reset,
		inputProps: {
			ref: inputRef,
			type: "file",
			className: "hidden",
			onChange: handleImageChange,
		},
	};
}
