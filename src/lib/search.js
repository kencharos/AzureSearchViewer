const AzureSearch = require('azure-search')
 
class AzureSearchAdaptor {

    constructor(endpoint, key, indexName) {
        this.indexName = indexName
        this.client = AzureSearch({
            url: endpoint,
            key:key});
    }

    /**
     * 座標 GeoJson変換
     * @param {double} longitude 経度,x 
     * @param {double} latitude 緯度,y
     */
    toGeo(longitude, latitude) {
        return {
            type: "Point",
            coordinates: [longitude, latitude]
        }
    }


    /**
     * ドキュメントを登録します。 配列の場合、まとめて複数件登録します。
     * keyが同一項目のドキュメントがある場合は更新します。
     * @param {Object | Array} docs 
     * @returns Promise{error | result<failCount:Int, failId:[failId]> }
     */
    addDocumentsAsync(docs) {
        let _docs = Array.isArray(docs) ? docs : [docs]

        return new Promise((resolve, reject) => {
            this.client.uploadDocuments(this.indexName, _docs, (error, result) => {
                // result<value:[{key, status, errorMessage, statusCode}]> の構成。
                // 部分的に失敗したデータは、status が false になる。
                if(error) return reject(error)
                else {
                    let failId = result.filter(v => v.status == false).map(v => v.key)
                    return resolve({failCount:failId.length, failId:failId})
                }
            })
        });
    }

    
    /**
     * 検索を行います。 queryオブジェクトには、REST API のパラメータ(search, filter, facet, top, skip, orderbyなど) が指定可能です。
     * ただし、filterなどの先頭の $ は不要です。
     * @Ref https://docs.microsoft.com/en-us/rest/api/searchservice/search-documents
     * @param {search, filter, facet, top, skip, orderby} query 
     * @returns Promise{error | {results, raw}}
     */
    search(query) {
        return new Promise((resolve, reject) => {
            this.client.search(this.indexName, query, (error, results, raw) => {
                if(error) return reject(error)
                else return resolve({results, raw})
            })
        });
    }
}

module.exports.AzureSearchAdaptor = AzureSearchAdaptor