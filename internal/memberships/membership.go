package memberships

const (
	CollectionName = "memberships"

	FieldPerson = "person"
	FieldGroup  = "group"
	FieldNote   = "note"
)

type Membership struct {
	ID     string `json:"id"`
	Person string `json:"person"`
	Group  string `json:"group"`
	Note   string `json:"note,omitempty"`
}
