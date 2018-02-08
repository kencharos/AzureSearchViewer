const AzureSearch = require('azure-search')
 
class AzureSearchAdaptor {

    constructor(endpoint, key) {
        this.client = AzureSearch({
            url: endpoint,
            key:key});
    }

    /**
     * サービスのインデックス一覧を取得する
     * @returens Promise{Array<string>}
     */
    indexesAsync() {
        return new Promise((resolve, reject) => {
            this.client.listIndexes((err, data)=> {
                if (err) return reject(err);
                else return resolve(data.map(i => i.name));
            })
        });
    }

    /**
     * ドキュメントを登録します。 配列の場合、まとめて複数件登録します。
     * keyが同一項目のドキュメントがある場合は更新します。
     * @param {string} index
     * @param {Object | Array} docs 
     * @returns Promise{error | array> }
     */
    addDocumentsAsync(index, docs) {
        let _docs = Array.isArray(docs) ? docs : [docs]

        return new Promise((resolve, reject) => {
            this.client.uploadDocuments(index, _docs, (error, result) => {
                if(error) return reject(error)
                else {
                    //console.log(result)
                    return resolve(result)
                }
            })
        });
    }

    
    deleteDocumentsAsync(index, docs) {
        let _docs = Array.isArray(docs) ? docs : [docs]

        return new Promise((resolve, reject) => {
            this.client.deleteDocuments(index, _docs, (error, result) => {
                if(error) return reject(error)
                else {
                    //console.log(result)
                    return resolve(result)
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
    search(index, query) {
        return new Promise((resolve, reject) => {
            this.client.search(index, query, (error, results, raw) => {
                if(error) return reject(error)
                else return resolve({results, raw})
            })
        });
    }
}

module.exports.AzureSearchAdaptor = AzureSearchAdaptor