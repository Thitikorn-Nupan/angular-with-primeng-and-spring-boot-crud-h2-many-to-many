import {HeaderColumn} from "../intermediary-entities/header-column";
import {DataTreeTable} from "../intermediary-entities/data-tree-table";
import {TreeNode} from "primeng/api";

export class UsefulHelper {
  public static convertObjectToHeaderColumns(object: any, ignoreKeys: string[]): HeaderColumn[] {
    const headerColumns = []
    const objectKeys = Object.keys(object)
    for (let key of objectKeys) {
      if (ignoreKeys.indexOf(key) === -1) {
        headerColumns.push({field: key, header: key.toUpperCase()})
      }
    }
    if (ignoreKeys.indexOf('action') === -1) { // if -1 is mean not found
      headerColumns.push({field: 'action', header: 'action'.toUpperCase()}) // basic mode update & delete buttons
    }
    return headerColumns
  }
  public static  convertModelToDataTreeTable(model: { data: any, subData: any[] | null } []): DataTreeTable<any>[] {
    const data: DataTreeTable<any>[] = []
    let subData: TreeNode<any>[] = []
    for (let i = 0; i < model.length!; i++) { // loop for subData
      if (model[i].subData?.length! > 0 && model[i].subData !== null) {
        for (let data of model[i].subData!) {
          subData.push({data: data})
        }
      }
      data.push({data: model[i].data, children: subData})
      subData = []
    }
    return data
  }
}
