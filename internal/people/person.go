package people

const (
	CollectionName = "people"

	FieldName     = "name"
	FieldNickname = "nickname"
)

type Person struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Nickname string `json:"nickname,omitempty"`
}
