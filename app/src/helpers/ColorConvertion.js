const ColorConvertion = ()=>{
    const rgb2hsl = (r,g,b)=>{
        r = r/255;
        g = g/255;
        b = b/255;
        let min = Math.min(r, g, b);
        let max = Math.max(r, g, b);
        let h = 0,s = 0 ,l = 0;
        //calculate lightness
        l = (min+max) / 2;
        //calc saturation
        if(min == max){
            s = 0;
        }
        else{
            if(l < 0.5)
                s = (max - min) / (max+min);
            else
                s = (max - min) / (2.0 - max -min);
        }
        //calc hue
        if( max == min){
            h = 0;
        }
        else{
            if(max == r) //result.h = (g - b) / d + (g < b ? 6 : 0);
                h = (g - b) / (max-min) + (g<b? 6: 0);
            else if(max == g) //result.h = (b - r) / d + 2;
                h = (b-r)/(max-min) + 2.0;
            else if (max == b) //result.h = (r - g) / d + 4;
                h = (r-g)/(max-min) + 4.0;

            //conver to degrees
            if(h < 0)
                h += 360;

            h = h * 60;
        }
        // return {h,s:s*100,l:l*100};
        return [h, s*100, l*100]
    }

    const hue2rgb = (p, q, t) => {
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q-p) * (2/3 - t) * 6;
        return p;
    }

    const hsl2rgb = (H,S,L) => {
        //normalize the HSL value
        let h = H / 360;
        let s = S / 100;
        let l = L / 100;
        let r,g,b;
        
        if( s == 0){
            r = g = b = l;
        }
        else{
            let q  = l < 0.5 ? l * (1+s) :  l + s - l * s;
            let p = 2 * l - q ;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p,q, h - 1/3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
    }

    const adjustSaturation = (r,g,b, saturation) => {
        //convert rgb to hsl
        let [h,s,l] = rgb2hsl(r,g,b);
        // console.log([h,s,l])
        // console.log([h,s+saturation,l])
        //return
        // console.log(hsl2rgb(...[h,s+saturation,l]))
        return hsl2rgb(...[h,s+saturation,l]);
    }

    const adjustLightness = (r,g,b, adjustment) => {
        let [h,s,l] = rgb2hsl(r,g,b);
        return hsl2rgb(...[h,s, l+adjustment]);
    }


    return {
        rgb2hsl,
        hsl2rgb,
        adjustSaturation,
        adjustLightness
    }
}