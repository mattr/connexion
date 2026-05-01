package groups

const (
	CollectionName = "groups"

	FieldName        = "name"
	FieldDescription = "description"
)

type Group struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
}
