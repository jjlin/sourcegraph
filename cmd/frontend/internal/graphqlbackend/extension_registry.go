package graphqlbackend

import (
	"context"
	"errors"
	"fmt"

	"github.com/sourcegraph/sourcegraph/cmd/frontend/internal/backend"
	"github.com/sourcegraph/sourcegraph/pkg/conf"
)

func (r *schemaResolver) ExtensionRegistry(ctx context.Context) (*extensionRegistryResolver, error) {
	if !conf.IsPlatformEnabled() {
		return nil, errors.New("platform disabled")
	}
	return &extensionRegistryResolver{}, nil
}

type extensionRegistryResolver struct{}

func (*extensionRegistryResolver) Extension(ctx context.Context, args *struct {
	ExtensionID string
}) (*registryExtensionMultiResolver, error) {
	return getExtensionByExtensionID(ctx, args.ExtensionID)
}

func getExtensionByExtensionID(ctx context.Context, extensionID string) (*registryExtensionMultiResolver, error) {
	local, remote, err := backend.GetExtensionByExtensionID(ctx, extensionID)
	if err != nil {
		return nil, err
	}
	if local != nil {
		return &registryExtensionMultiResolver{local: &registryExtensionDBResolver{v: local}}, nil
	}
	if remote == nil {
		return nil, fmt.Errorf("no remote extension found with ID %q", extensionID)
	}
	return &registryExtensionMultiResolver{remote: &registryExtensionRemoteResolver{v: remote}}, nil
}

func (*extensionRegistryResolver) LocalExtensionIDPrefix() *string {
	return backend.GetLocalRegistryExtensionIDPrefix()
}
