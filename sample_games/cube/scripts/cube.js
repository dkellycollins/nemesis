require.config({
   paths: {
       lib: "../../node_modules"
   }
});

require(['nemesis'], function (nemesis) {
    alert(nemesis.TEST);
});
