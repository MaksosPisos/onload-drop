<template>
    <div>
        <i class="fa-solid fa-circle-check"></i>
        <span class="flex-grow">{{ toastName }}</span>
        <div class="absolute top-0 right-1 w-4 h-4">
            <i class="fa-solid fa-xmark"></i>
        </div>
    </div>
</template>


<script>
export default {
    props: ['toastName']
}

</script>