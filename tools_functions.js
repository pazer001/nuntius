'use strict';
module.exports  =   {
    arrayValueToKey: function (array, key) {
        if(!array) return false;
        let index           =   0,
            arrayLength     =   array.length,
            returnObject    =   [];
        for(index; index < arrayLength; index++) {
            if(!returnObject[array[index][key]]) returnObject[array[index][key]]    =   array[index][key];
        }
        return returnObject;
    }
}


