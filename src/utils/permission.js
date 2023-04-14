import storage from '@/utils/storage'


export function checkUserPermission(permission) {
    let allPermissions = storage.get(process.env.VUE_APP_ALL_PERMISSIONS_KEY);
    if (!allPermissions) {
        return false;
    }
    let userPermissions = storage.get(process.env.VUE_APP_USER_PERMISSIONS_KEY);

    for (let i = 0; i < allPermissions.length; i++) {
        if (allPermissions[i] == permission) {
            for (let i = 0; i < userPermissions.length; i++) {
                if (userPermissions[i] == permission) {
                    return true;
                }
            }
            return false;
        }
    }
    return true;
}

export function getChildPermissions(parentKey) {
    if (!parentKey) {
        return [];
    }
    let allPermissions = storage.get(process.env.VUE_APP_ALL_PERMISSIONS_KEY);
    if (!allPermissions) {
        return [];
    }
    let childPermissions = [];
    for (let i = 0; i < allPermissions.length; i++) {
        if (allPermissions[i].startsWith(parentKey)) {
            childPermissions.push(allPermissions[i]);
        }
    }
    return childPermissions;
}

export function dropParentsPermission(value, permissionData, parentFiledName) {
    if (!(value instanceof Array)) {
        return value;
    }
    let leafIds = [];
    for (let i = 0; i < value.length; i++) {
        let isFind = false;
        for (let j = 0; j < permissionData.length; j++) {
            if (value[i] == permissionData[j][parentFiledName]) {
                isFind = true;
                break;
            }
        }
        if (!isFind) {
            leafIds.push(value[i]);
        }
    }
    return leafIds;
}