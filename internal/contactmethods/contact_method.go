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

type ContactMethod struct {
	ID     string `json:"id"`
	Person string `json:"person"`
	Kind   string `json:"kind"`
	Label  string `json:"label,omitempty"`
	Value  string `json:"value"`
}
