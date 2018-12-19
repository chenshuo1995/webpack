<template>
  <div id="app">
    <div id="title"></div>
    <div id="title1"></div>
    <div id="img1">css background</div>
    <div id="less">less</div>
    <img src="./images/1.png" alt="" title="我是个img标签">
    <div id="json"></div>
    <p>{{msg}}</p>
    <img src="./images/1.png">
    <!-- <router-view/> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted(){
    let abc = "hello webpack";
    document.getElementById("title").innerHTML = abc;
    $("#title").css({
        "color":'#f0f',
        "fontSize":'24px',
        "background":'#ff0'
    })
    var json =require('../config.json');
    document.getElementById("json").innerHTML='json---' + json.name;
    document.getElementById("title1").innerHTML = "my name is mr.chen"
  }
}
</script>

<style type="text/css" lang="less">
    h2{
        color:#ff0000;
    }
    #app {
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    h1, h2 {
        font-weight: normal;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        text-align: left;
        margin: 0 10px;
    }
    a {
        color: #42b983;
    }
</style>