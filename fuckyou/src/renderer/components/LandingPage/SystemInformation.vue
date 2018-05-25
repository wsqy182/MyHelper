<template>
    <div>
        <div class="title">系统信息</div>
        <div class="items">
            <div class="item">
                <div class="name">路径:</div>
                <div class="value">{{ path }}</div>
            </div>
            <div class="item">
                <div class="name">路由名称:</div>
                <div class="value">{{ name }}</div>
            </div>
            <div class="item">
                <div class="name">Vue.js版本:</div>
                <div class="value">{{ vue }}</div>
            </div>
            <div class="item">
                <div class="name">Electron版本:</div>
                <div class="value">{{ electron }}</div>
            </div>
            <div class="item">
                <div class="name">Node版本:</div>
                <div class="value">{{ node }}</div>
            </div>
            <div class="item">
                <div class="name">平台版本:</div>
                <div class="value">{{ platform }}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                electron: process.versions['atom-shell'],
                name: this.$route.name,
                node: process.versions.node,
                path: this.$route.path,
                platform: require('os').platform(),
                vue: require('vue/package.json').version
            }
        }
    }
</script>

<style scoped>
    .title {
        color: #888;
        font-size: 18px;
        font-weight: initial;
        letter-spacing: .25px;
        margin-top: 10px;
    }

    .items {
        margin-top: 8px;
    }

    .item {
        display: flex;
        margin-bottom: 6px;
    }

    .item .name {
        color: #6a6a6a;
        margin-right: 6px;
    }

    .item .value {
        color: #35495e;
        font-weight: bold;
    }
</style>
