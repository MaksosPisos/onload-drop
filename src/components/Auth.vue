<template>
    <div class="">
        <form @submit.prevent="submitAuth"
            class=" flex flex-col bg-slate-800 p-4 gap-4 min-w-[350px] text-white shadow rounded">
            <div class=" font-extrabold uppercase text-center pb-2 text-xl tracking-wide">
                Authtorization
            </div>
            <div class="flex gap-4 items-center justify-between">
                <div class="min-w-[70px]">
                    Login
                </div>
                <input type="text" class="input input-bordered input-success w-full max-w-xs" placeholder="Login"
                    v-model="this.$store.state.login">
            </div>
            <div class="flex gap-4 items-center justify-between relative">
                <div class="min-w-[70px]">
                    Password
                </div>
                <input :type="showPass ? 'text' : 'password'" class="input input-bordered input-success w-full max-w-xs"
                    v-model="this.$store.state.password" placeholder="Password">

                <button type="button" @click.prevent="showPass = !showPass" class="absolute right-2">
                    <transition mode="out-in">
                        <i class="fa-solid fa-eye min-w-[20px]" v-if="!showPass"></i>
                        <i class="fa-solid fa-eye-slash min-w-[20px]" v-else-if="showPass"></i>
                    </transition>
                </button>
            </div>
            <button type="submit" class="button submit " :disabled="GET_DISABLED_SUBMIT_AUTH"
                :class="{ 'pointer-events-none': GET_DISABLED_SUBMIT_AUTH, 'opacity-20': GET_DISABLED_SUBMIT_AUTH }">
                Войти
            </button>
        </form>
    </div>
</template>


<script>
import axios from 'axios';
export default {
    data() {
        return {
            showPass: false,
        }
    },
    computed: {
        password() {
            return this.$store.state.password
        },
        login() {
            return this.$store.state.login
        },
        API() {
            return this.$store.state.API
        },
        GET_DISABLED_SUBMIT_AUTH() {
            return this.$store.getters.GET_DISABLED_SUBMIT_AUTH
        }
    },
    methods: {
        submitAuth() {
            this.SET_JWT('ssffss')
            const options = {
                method: 'POST',
                url: `${this.API}/api-token-auth/`,
                headers: {
                    'Content-Type': 'application/json',
                    // "Access-Control-Allow-Origin": "*",
                    // "Access-Control-Allow-Methods": "POST, PUT",
                    // "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
                },
                data: { username: this.login, password: this.password },
            };
            axios.request(options).then(function (response) {
                console.log(response.data);
                localStorage.jwt = response.data
                // this.SET_JWT(response.data)
            }).catch(function (error) {
                console.error(error);
            });
        },
        SET_JWT(jwt) {
            return this.$store.commit('SET_JWT', jwt)
        },
    },
}
</script>