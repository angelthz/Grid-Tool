

class ImageAdjust{
    
    static brightness(imageData, adjustment){
        const data = imageData.data;
        for(let i=0; i<data.length; i+=4){
            // const avg = (data[i]+data[i+1]+data[i+2]) / 3;
            // data [i] = avg + adjustment * (data[i]-avg);
            // data [i+1] = avg + adjustment  * (data[i+1]-avg);
            // data [i+2] = avg + adjustment  * (data[i+2]-avg);
            let alpha = 1.3;
            let beta = adjustment;
            const r = (alpha * data[i]) + beta;
            const g = (alpha * data[i+1]) + beta;
            const b = (alpha	 * data[i+2]) + beta;

            data [i] = r;
            data [i+1] = g;
            data [i+2] = b;
        }
        return imageData;
    }

    static contrast(imageData, adjust){
        const data = imageData.data;
        let factor = (259 * (adjust+255)) / (255 * (259-adjust));
        for(let i=0; i<data.length; i+=4){
            data[i] = Math.trunc(factor * (data[i]-128)+128);
            data[i+1] = Math.trunc(factor * (data[i+1]-128)+128);
            data[i+2] = Math.trunc(factor * (data[i+2]-128)+128);
        }
        return imageData;
    }

    static saturationLib(imageData, adjustment){
        adjustment *= -0.01;
        const data = imageData.data;
        for(let i=0; i<data.length; i+=4){
            let max = Math.max(data[i], data[i+1], data[i+2]);
            if(data[i] !== max)
                data[i] += (max - data[i]) * adjustment;
            if(data[i+1] !== max)
                data[i+1] += (max - data[i+1]) * adjustment;
            if(data[i+2] !== max)
                data[i+2] += (max - data[i+2]) * adjustment;
            // let r = data[i], g = data[i+1], b = data[i+2];
            // if(r>g && r>b){
            //     data[i] += adjustment;
            //     if(g<b)
            //         data[i+1] -= adjustment;
            //     else
            //         data[i+2] -= adjustment;
            // }
            // if(g>r && g>b){
            //     data[i+1] += adjustment;
            //     if(r<b)
            //         data[i] -= adjustment;
            //     else
            //         data[i+2] -= adjustment;
            // }
            // if(b>r && b>g){
            //     data[i+2] += adjustment;
            //     if(r<g)
            //         data[i] -= adjustment;
            //     else
            //         data[i+1] -= adjustment;
            // }
        }
        return imageData;
    }


    static shadows(imageData, adjustment){
        const data = imageData.data;
        for(let i = 0; i<data.length; i+4){
            let avg = (data[i] + data[i+1] +data[i+2]) / 3;
            if(avg<128){
                data [i] -= adjustment;
                data [i+1] -= adjustment;
                data [i+2] -= adjustment;
            }
        }

        return imageData;
    }
}