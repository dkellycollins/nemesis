require.config({
   paths: {
       lib: "../../node_modules"
   }
});

require(['nemesis'], function (nemesis) {
    if(!!nemesis.CANVAS && !!nemesis.GL) {
        alert("Worked");
    } else {
        alert("Failed");
    }
});
