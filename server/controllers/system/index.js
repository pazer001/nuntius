var DB      =   require('../../DB');

class System {
    getBrands(companyId) {
        return new Promise((resolve) => {
            if(!companyId) resolve('false');
            let brandsQuery =   `SELECT
                                    brands.id,
                                    brands.name,
                                    brands.url,
                                    brands.company_id,
                                    brands.image_url
                                FROM
                                    nuntius.brands WHERE brands.company_id = '${companyId}'`;
            DB.Q(brandsQuery).then((brands) => {
                let brandsData  =   {},
                    brandsLength    =   brands.length,
                    brandsIndex     =   0;


                for(brandsIndex; brandsIndex < brandsLength; brandsIndex++) {
                    brandsData[brands[brandsIndex].id]  =   brands[brandsIndex];
                }
                resolve(brandsData)
            })
        })
    }
}

const system    =   new System;
module.exports  =   system;