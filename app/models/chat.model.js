module.exports = (mongoose, collectionName) => {
    var schema = mongoose.Schema(
            {
                message: String
            },
            {timestamps: true}
        );

    //If you use this app with a front-end that needs id field instead of _id, you have to override toJSON
    // schema.method("toJSON", function() {
    //     const { __v, _id, ...object } = this.toObject();
    //     object.id = _id;
    //     return object;
    // });

    // const Chat = mongoose.model(collectionName, schema);

    return schema;
};