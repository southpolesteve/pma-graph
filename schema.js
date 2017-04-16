module.exports = `
type Object {
  id: String!
  titles: [String!]
  gallery: Gallery!
  period: Period
  tumbnailImageURL: String
  fullImageURL: String
  tags: [Tag]
}

type Tag {
  description: String!
  objects: [Object]
}

type Floor {
  number: Int!
  galleries: [Gallery!]!
}

type Gallery {
  number: String!
  objects: [Object]!
}

type Section {
  name: String!
}

type Period {
  name: String!
  start: String
  end: String
}

type Location {
  name: String!
  objects: [Object]
}

type Query {
  object(id: Int!): Object
  floor(number: Int!): Floor
  gallery(number: String!): Gallery
  location(name: String!): Location
  tag(description: String!): Tag
}

schema {
  query: Query
}
`
