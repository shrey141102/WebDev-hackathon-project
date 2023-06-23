function sv(id, vi){
    document.getElementById(id).style.display = vi;
    if(vi == 'none'){
        document.getElementById(id).style.opacity = '0';
    }
    else{
        document.getElementById(id).style.opacity = '1';
    }
    
}

window.onload = function() {
  Particles.init({
    selector: '.background',
    connectParticles: true,
    maxParticles: 180,
  });
};