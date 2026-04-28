package people

const (
	CollectionName = "people"

	FieldName     = "name"
	FieldSortName = "sort_name"
	FieldNickname = "nickname"
)

type Person struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	SortName string `json:"sort_name,omitempty"`
	Nickname string `json:"nickname,omitempty"`
}
