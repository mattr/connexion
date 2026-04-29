package migrations

import (
	"github.com/mattr/connexion/internal/people"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

const authenticatedRule = "@request.auth.id != ''"

func init() {
	m.Register(func(app core.App) error {
		collection := core.NewBaseCollection(people.CollectionName)
		collection.ListRule = types.Pointer(authenticatedRule)
		collection.ViewRule = types.Pointer(authenticatedRule)
		collection.CreateRule = types.Pointer(authenticatedRule)
		collection.UpdateRule = types.Pointer(authenticatedRule)
		collection.DeleteRule = types.Pointer(authenticatedRule)

		collection.Fields.Add(&core.TextField{
			Name:        people.FieldName,
			Required:    true,
			Presentable: true,
			Max:         255,
		})
		collection.Fields.Add(&core.TextField{
			Name: people.FieldSortName,
			Max:  255,
		})
		collection.Fields.Add(&core.TextField{
			Name: people.FieldNickname,
			Max:  255,
		})

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId(people.CollectionName)
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
