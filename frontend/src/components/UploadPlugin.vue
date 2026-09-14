<template>
	<FileUploader
		:fileTypes="['image/*', 'video/*', 'audio/*', '.pdf']"
		:uploadArgs="uploadArgs"
		:validateFile="validateFile"
		@success="(data) => addFile(data)"
		ref="fileUploader"
		class="hide"
	/>
</template>
<script setup>
import { FileUploader } from 'frappe-ui'
import { onMounted, ref, nextTick, computed } from 'vue'

const fileUploader = ref(null)
const emit = defineEmits(['fileUploaded'])

const props = defineProps({
	onFileUploaded: {
		type: Function,
		required: true,
	},
	uploadContext: {
		type: Object,
		default: () => ({}),
	},
})

// Attach to the lesson only once it exists: a null docname with doctype set
// makes the File doctype reject the upload.
const uploadArgs = computed(() => {
	const args = { private: true }
	const docname = props.uploadContext?.docname
	if (docname) {
		args.doctype = 'Course Lesson'
		args.docname = docname
		args.fieldname = props.uploadContext?.fieldname || 'content'
	}
	return args
})

onMounted(async () => {
	await nextTick()
	const fileInput = fileUploader.value.$el.querySelector('input[type="file"]')
	if (fileInput) {
		fileInput.click()
	}
})

const addFile = (file) => {
	props.onFileUploaded({
		file_url: file.file_url,
		file_type: file.file_type,
	})
}

// Frappe's nginx config caps request bodies at 25 MB, so reject larger
// files here with a clear message instead of a bare 413 from the server.
const MAX_FILE_SIZE = 25 * 1024 * 1024

const validateFile = (file) => {
	let extension = file.name.split('.').pop().toLowerCase()
	if (!['jpg', 'jpeg', 'png', 'mp4', 'mov', 'mp3', 'pdf'].includes(extension)) {
		return 'Only image and video files are allowed.'
	}
	if (file.size > MAX_FILE_SIZE) {
		return 'File is too large. Maximum size is 25 MB.'
	}
}

const isVideo = (type) => {
	return ['mov', 'mp4', 'avi', 'mkv', 'webm'].includes(type.toLowerCase())
}

const isAudio = (type) => {
	return ['mp3', 'wav', 'ogg'].includes(type.toLowerCase())
}
</script>
