/**
 * Given a path and the input data corresponding to that path, return the data
 * @param search_path {string} The path to get the data, example: .order.id
 * @param search_data {Object} The actual data: { order: {id: 123 } }
 * @returns {string|Number|Array} The data of the path: 123
 */
export function getInputData(search_path: string, search_data: any): any {

    let np = search_path.split('.')

    if (np.length === 0) {
        return 'source path error: ' + search_path
    }

    np[0] = np[0].trim()

    if (np[0] === '') {
        // Stupid hack to clean up
        np = np.slice(1)
    }

    let returnData = ''

    // return whole array
    if (np[0][np[0].length - 1] === '*') {
        return search_data[np[0].substring(0, np[0].length - 1)]
    }

    // IF it is the only value, return that value
    if (np.length === 1) {
        return search_data[np[0]]
    }

    // IF it is a nested data, recurse
    if (np.length > 1) {
        return getInputData(np.slice(1).join('.'), search_data[np[0]])
    }

    return returnData
}

export function dataTypeCleanup(dataType: string, inputData: string): any {
    if (dataType === 'boolean') {
        return inputData === "true"
    }

    if (dataType === 'number') {
        return Number(inputData)
    }

    return inputData
}

/**
 * Given a schema, create new data based on that schema, from the input data
 * @param schemaMap {Object} Mapping of the wanted schema
 * @param inputData {Object} Actual data to be mapped to the new schema
 * @param internalSchemaArrayTracker {Object} Recursive usage only, to track internal loop sequence
 * @returns {Object} The output of the mapped data
 */
export function newSchemaLoop(schemaMap: any, inputData: any, internalSchemaArrayTracker?: any): any {

    // Initialize if non existence
    // This internal schema array tracker exist to help track the current loop index of an array
    if (!internalSchemaArrayTracker) {
        internalSchemaArrayTracker = {}
    }

    let tmpData: any = {}
    Object.keys(schemaMap).forEach((s) => {
        let schema = schemaMap[s]
        let overrideSource = schema.source
        let schemaDataType = schema.dataType.trim().toLowerCase()

        // If object exist in internal s tracker, replace them
        Object.keys(internalSchemaArrayTracker).forEach((sc) => {
            overrideSource = overrideSource.replaceAll(sc, internalSchemaArrayTracker[sc])
        })

        // If it is a string or number data type, immediately return the value
        if (schemaDataType === 'string' || schemaDataType === 'number' || schemaDataType === 'boolean') {
            // IF fixed data, return fix data immediately
            if (overrideSource[0] !== '.') {
                tmpData[s] = dataTypeCleanup(schemaDataType, overrideSource)
                return
            }

            // If magic add formula, do both and return
            let addFormulaPath = overrideSource.split('+')
            if (addFormulaPath.length > 1) {
                let addResult: any[] = []
                addFormulaPath.forEach((afp: string) => {
                    afp = afp.trim()
                    // IF it is a static text, add it in
                    if (afp[0] !== '.') {
                        addResult.push(afp)
                        return
                    }
                    addResult.push(getInputData(afp, inputData))
                })

                tmpData[s] = addResult.join('')
                return
            }

            let getDataValue = getInputData(overrideSource, inputData)
            tmpData[s] = dataTypeCleanup(schemaDataType, getDataValue)
            return
        }

        // If it is a JSON 'Object', recurse to get all the keys
        if (schemaDataType === 'object') {
            tmpData[s] = newSchemaLoop(schema.nestedData, inputData, internalSchemaArrayTracker)
        }

        // IF it is an 'array', first, get the Array length by the source
        if (schemaDataType === 'array') {
            let newArray = []
            // If the source is a static 1, create a single array only, otherwise, decide the size of an array based on the previous value
            if (overrideSource === '1') {
                newArray.push(newSchemaLoop(schema.nestedData, inputData))
                tmpData[s] = newArray
                return
            }

            if (overrideSource[overrideSource.length - 1] !== '*') {
                tmpData[s] = 'no * indicator at : ' + overrideSource
                return
            }

            let sourceArrayData = getInputData(overrideSource, inputData)
            if (!sourceArrayData || sourceArrayData.length === 0) {
                tmpData[s] = 'source no data at : ' + overrideSource
                return
            }


            let createArrayLength = getInputData(overrideSource, inputData).length
            for (let i = 0; i < createArrayLength; i++) {
                let internalNewSource = overrideSource.substring(0, overrideSource.length - 1) + '.' + i.toString()
                internalSchemaArrayTracker[overrideSource] = internalNewSource

                newArray.push(newSchemaLoop(schema.nestedData, inputData, internalSchemaArrayTracker))
            }

            tmpData[s] = newArray
        }
    })

    return tmpData
}

/**
 * Given an input Object, create a schema map from it
 * @param inputData {Object} Input data to create schema from
 * @param internalParentPath {String} Internal usage only
 * @returns {Object}
 */
export function createSchemaMap(inputData: any, internalParentPath?: string): any {
    let returnMap: any = {}
    if (!internalParentPath) {
        internalParentPath = ''
    }

    Object.keys(inputData).forEach((key) => {
        let dataNow = inputData[key]
        let newPath = internalParentPath + '.' + key
        newPath = newPath.trim()

        if (dataNow === null) {
            returnMap[key] = {
                dataType: 'string',
                source: newPath
            }
            return
        }

        if (typeof dataNow === 'string' || typeof dataNow === 'number' || typeof dataNow === 'boolean') {
            returnMap[key] = {
                dataType: typeof dataNow,
                source: newPath
            }
            return
        }

        // If it is array, get the first value of the array to map
        if (Array.isArray(dataNow) && dataNow.length > 0) {
            newPath = newPath + '*'
            returnMap[key] = {
                dataType: 'array',
                source: newPath,
                nestedData: createSchemaMap(dataNow[0], newPath)
            }
            return
        }

        if (typeof dataNow === 'object') {
            returnMap[key] = {
                dataType: 'object',
                source: newPath,
                nestedData: createSchemaMap(dataNow, newPath)
            }
            return
        }
    })

    return returnMap
}
