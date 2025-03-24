/**
 * Maps keys from one object to another based on a given mapping configuration.
 *
 * @param {Record<string, any>} value - The object whose keys need to be mapped.
 * @param {Record<any, string>} mappingKeys - The mapping configuration object.
 * @returns {Record<string, string>} - The object with mapped keys and values.
 * @example 
 * 
 * const conFiguration: {
 *    unitId: 'UnitReference',
 *    garbage: '',
 * }
 * 
 *  const dummyValue = {
 *    unitId: 123,
 *    dummy: 25,
 *    garbage: 56
 *  }
 * 
 * getMappedKeyObject(dummyValue, conFiguration) // returns {UnitReference: 123}
 * 
 */
function getMappedKeyObject(value: Record<string, any>, mappingKeys: Record<string, any>): Record<string, string> {
  const temp: Record<string, any> = {}
  Object.keys(mappingKeys).forEach((key: string) => {
    if (mappingKeys[key].key && (mappingKeys[key].portal == '*' || mappingKeys[key].portal.length)) {
      temp[mappingKeys[key].key] = value?.[key] || ""
    }
  });
  return temp;
}


export default getMappedKeyObject;