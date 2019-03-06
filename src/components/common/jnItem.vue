<template>
    <div class="jnItem">
        <div v-if="config.icon" class="icon">
            <slot name="icon"></slot>
        </div>
        <div v-if="config.left" class="left">
            <slot name="left"></slot>
        </div>
        <span v-if="config.arrow" class="arrow"></span>
        <div v-if="config.right" class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "listItem",
        props: {
            config: {
                type: Object,
                default: () => {
                    return new Object({
                        icon: false,
                        left: true,
                        right: true,
                        arrow: false
                    })
                },
            }
        }
    }
</script>

<style scoped lang="less">
    .jnItem {
        width: 100%;
        height: 100px;
        background: #ffffff;
        padding: 0 32px;
        box-sizing: border-box;
        position: relative;
        border-bottom: 1px solid #e8e8e8;

        .icon {
            float: left;
            margin-right: 26px;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
        }

        .left {
            float: left;
            line-height: 100px;
            font-size: 28px;
            color: #333;
        }

        .right {
            float: right;
            text-align: right;
            line-height: 100px;
            font-size: 28px;
            color: #333;
        }

        .arrow {
            width: 15px;
            height: 30px;
            float: right;
            background: url("../../assets/img/common/right_arrow.png") no-repeat;
            background-size: 100%;
            margin-top: 35px;
            margin-left: 16px;
        }
    }
</style>