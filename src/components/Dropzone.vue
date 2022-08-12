<template>
    <div class="bg-slate-700 max-w-[380px] p-4 shadow rounded flex flex-col items-center"
        :class="{ 'gap-2': files.length > 0 }">
        <form class="flex items-center gap-4" id="form">
            <input type="file" multiple="true" accept=".txt" ref="file" class="hidden" @change="changeHandler($event)">
            <transition appear>
                <button type="button" class="button" @click.prevent="upload">
                    Загрузить
                </button>
            </transition>
            <transition name="btn">
                <button type="submit" ref="submit" class="button submit" @click.prevent="submit" v-if="files.length > 0"
                    :disabled="disabledSubmit"
                    :class="{ 'pointer-events-none': disabledSubmit, 'opacity-30': disabledSubmit }">
                    Отправить
                </button>
            </transition>
        </form>
        <div class="flex flex-wrap gap-4 items-center justify-center" v-if="files.length > 0">
            <transition-group name="files">
                <div v-for="(file, index) in files" :key="file.name" class="bg-slate-600 p-4 rounded shadow relative">
                    <div class="text-white flex flex-col justify-center items-center w-[120px] max-w-[120px] min-h-[120px]"
                        key="test">
                        <span key="test1">
                            {{ file.name }}
                        </span>
                        <span key="test2">
                            {{ convert(file.size) }} {{ this.size }}
                        </span>
                    </div>
                    <div key="test3"
                        class="absolute top-2 right-2 text-white rounded-full bg-slate-800 flex items-center justify-center font-extrabold text-lg h-[36px] w-[36px] cursor-pointer hover:bg-slate-500 transition-colors"
                        @click="removeFile(index, $event)">
                        &times;
                    </div>
                    <div class="bg-slate-200 w-full h-6 relative rounded shadow-md" v-if="load">
                        <transition name="progress-bar">
                            <div class="bg-teal-600 h-6 rounded shadow-md transition-all" :id="index + 1000">
                                <!-- {{progress[index]}} -->
                            </div>
                        </transition>
                        <transition name="progress-tex transition-all">
                            <span class="progress-text absolute" :id="index">
                                0
                            </span>
                        </transition>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
    <div class="absolute top-4 right-4 flex flex-wrap flex-col gap-2">
        <transition-group name="toast">
            <Toast v-for="(toast, index) in toasts"
                class="bg-teal-600/50 hover:opacity-70 transition-all cursor-pointer px-4 py-2 rounded shadow-md text-center relative text-white flex items-center justify-between gap-2 w-[200px]"
                @click="closeToast(index)" :toastName="toast.name" key="toast">
            </Toast>
        </transition-group>


    </div>
</template>

<script>
import axios from 'axios'
// import FormData from 'form-data'
// import fs from 'fs'
// import CryptoJS from "crypto-js/md5";
import Toast from './Toast.vue'
export default {
    components: {
        Toast
    },
    data() {
        return {
            input: null,
            files: [],
            showPreview: false,
            size: '',
            lazyLoad: [],
            load: false,
            toasts: [],
            disabledSubmit: false
        }
    },
    computed: {
        API() {
            return this.$store.state.API
        },
    },
    methods: {
        async submit() {
            let URL = this.API + '/files'
            this.disabledSubmit = true;
            this.load = true;
            this.files.forEach(async (file, index) => {
                let size = file.size;
                let prevSize = 0;
                let reader = new FileReader();
                reader.onload = ev => {
                    let md5 = this.$CryptoJS.MD5(ev.target.result).toString();
                    console.log(md5);
                }
                reader.readAsBinaryString(file)

                if (size > 1048576) {
                    for (let i = Math.ceil(size / 1048576); i--; i > 0) {
                        // reader.readAsText(file.slice(prevSize, prevSize + 5));
                        this.lazyLoad.push(file.slice(prevSize, prevSize + 1048576))
                        prevSize += 1048576;
                        // console.log(prevSize);
                    }
                }
                let start = 0;
                let end = 0;
                let options;
                for( const blob of this.lazyLoad){
                    end = start + blob.size
                    const form = new FormData();
                    form.append('file', blob);
                    form.append('filename', file.name);
                    options = {
                        method: 'PUT',
                        url: URL,
                        headers: {
                            // 'Content-disposition': 'form-data',
                            // 'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
                            'Authorization': 'Token dcd0d5a14f0052c5cb762375a397661df78ed51c',
                            'Content-Range': `bytes ${start}-${end - 1}/${size}`,
                        },
                        data: form
                    };
                    start = end;
                    console.log(URL);
                    await axios.request(options)
                        .then(function (response) {
                            URL = response.data.url
                            console.log(response.data);
                        }).catch(function (error) {
                            console.error(error);
                        });
                    console.log(URL);
                }
                // this.lazyLoad.forEach(async (blob, indexBlob) => {
                    // end = start + blob.size
                    // const form = new FormData();
                    // form.append('file', blob);
                    // form.append('filename', file.name);
                    // options = {
                    //     method: 'PUT',
                    //     url: URL,
                    //     headers: {
                    //         // 'Content-disposition': 'form-data',
                    //         // 'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001',
                    //         'Authorization': 'Token dcd0d5a14f0052c5cb762375a397661df78ed51c',
                    //         'Content-Range': `bytes ${start}-${end - 1}/${size}`,
                    //     },
                    //     data: form
                    // };
                    // start = end;
                    // console.log(URL, indexBlob);
                    // await axios.request(options)
                    //     .then(function (response) {
                    //         URL = response.data.url
                    //         console.log(response.data, indexBlob);
                    //     }).catch(function (error) {
                    //         console.error(error);
                    //     });
                    // console.log(URL, indexBlob);
                // })
            })
        },
        upload() {
            this.load = false
            this.files = []
            this.input = this.$refs.file
            this.input.click()
            console.log('upload');
        },
        changeHandler(e) {
            if (!e.target.files) {
                return
            }
            const filesinput = this.$refs.file
            // console.log(filesinput.files[0]);
            const newForm = new FormData()
            newForm.append('key', filesinput.files[0]);

            for (let [name, value] of newForm) {
                console.log(name, value);
            }
            this.files = Array.from(e.target.files)
            this.showPreview = true;
            this.files.forEach(file => {
                // console.log(file);
            })
        },
        convert(byte) {
            const KB = 1024;
            const MB = 1048576;
            const GB = 1073741824;
            if ((byte / MB).toFixed(2) >= 1000) {
                this.size = 'GB'
                return (byte / GB).toFixed(2)
            } else if ((byte / MB).toFixed(2) > 0) {
                this.size = 'MB'
                return (byte / MB).toFixed(2)
            } else {
                this.size = 'KB'
                return (byte / KB).toFixed(4)
            }
        },
        removeFile(index, e) {
            this.files.splice(index, 1)
        },
        closeToast(index) {
            this.toasts.splice(index, 1)
        },
    }
}
</script>

<style>
</style>