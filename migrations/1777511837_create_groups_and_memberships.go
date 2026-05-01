package migrations

import (
	"github.com/mattr/connexion/internal/groups"
	"github.com/mattr/connexion/internal/memberships"
	"github.com/mattr/connexion/internal/people"
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
	"github.com/pocketbase/pocketbase/tools/types"
)

func init() {
	m.Register(func(app core.App) error {
		peopleCollection, err := app.FindCollectionByNameOrId(people.CollectionName)
		if err != nil {
			return err
		}

		groupsCollection := core.NewBaseCollection(groups.CollectionName)
		groupsCollection.ListRule = types.Pointer(authenticatedRule)
		groupsCollection.ViewRule = types.Pointer(authenticatedRule)
		groupsCollection.CreateRule = types.Pointer(authenticatedRule)
		groupsCollection.UpdateRule = types.Pointer(authenticatedRule)
		groupsCollection.DeleteRule = types.Pointer(authenticatedRule)
		groupsCollection.Fields.Add(&core.TextField{
			Name:        groups.FieldName,
			Required:    true,
			Presentable: true,
			Max:         255,
		})
		groupsCollection.Fields.Add(&core.TextField{
			Name: groups.FieldDescription,
			Max:  5000,
		})

		if err := app.Save(groupsCollection); err != nil {
			return err
		}

		membershipsCollection := core.NewBaseCollection(memberships.CollectionName)
		membershipsCollection.ListRule = types.Pointer(authenticatedRule)
		membershipsCollection.ViewRule = types.Pointer(authenticatedRule)
		membershipsCollection.CreateRule = types.Pointer(authenticatedRule)
		membershipsCollection.UpdateRule = types.Pointer(authenticatedRule)
		membershipsCollection.DeleteRule = types.Pointer(authenticatedRule)
		membershipsCollection.Fields.Add(&core.RelationField{
			Name:          memberships.FieldPerson,
			CollectionId:  peopleCollection.Id,
			CascadeDelete: true,
			MaxSelect:     1,
			Required:      true,
		})
		membershipsCollection.Fields.Add(&core.RelationField{
			Name:          memberships.FieldGroup,
			CollectionId:  groupsCollection.Id,
			CascadeDelete: true,
			MaxSelect:     1,
			Required:      true,
		})
		membershipsCollection.Fields.Add(&core.TextField{
			Name: memberships.FieldNote,
			Max:  5000,
		})

		return app.Save(membershipsCollection)
	}, func(app core.App) error {
		for _, name := range []string{memberships.CollectionName, groups.CollectionName} {
			collection, err := app.FindCollectionByNameOrId(name)
			if err != nil {
				continue
			}

			if err := app.Delete(collection); err != nil {
				return err
			}
		}

		return nil
	})
}
