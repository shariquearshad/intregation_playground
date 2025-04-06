import { parseUnits } from '@ethersproject/units';
import { toString as _toString } from 'lodash';
export function multiplyNumbers(a:number,b:number){
    try{
        const result = parseUnits(_toString(a),b);
        return result; 
    }
    catch(e){
        console.log('error',e);
        return parseUnits(_toString(0),0);
    }
}
export function removeLeadingZeroesFromHex(hex:string){
    return hex.replace(/^0x0*/, '0x');
}