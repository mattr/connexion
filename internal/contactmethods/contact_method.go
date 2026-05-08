package contactmethods

const (
	CollectionName = "contact_methods"

	FieldPerson = "person"
	FieldKind   = "kind"
	FieldLabel  = "label"
	FieldValue  = "value"
)

const (
	KindEmail = "email"
	KindPhone = "phone"
	KindWeb   = "web"
	KindOther = "other"
)

var Kinds = []string{
	KindEmail,
	KindPhone,
	KindWeb,
	KindOther,
}
