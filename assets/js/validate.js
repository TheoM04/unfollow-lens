// Validate Followers JSON structure (Array where elements have string_list_data with 'value')
function isValidFollowersFile(data) {
    return Array.isArray(data) &&
        data.length > 0 &&
        Array.isArray(data[0]?.string_list_data) &&
        typeof data[0].string_list_data[0]?.value === "string";
}

// Validate Following JSON structure (Object containing 'relationships_following' array)
function isValidFollowingFile(data) {
    return data !== null &&
        typeof data === "object" &&
        !Array.isArray(data) &&
        Array.isArray(data.relationships_following) &&
        data.relationships_following.length > 0 &&
        typeof data.relationships_following[0]?.title === "string";
}